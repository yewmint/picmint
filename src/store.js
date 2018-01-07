/**
 * @file store.js
 * @author yewmint
 */

import { format } from 'util'
import { getFiles, md5 } from './utils'
import { join } from 'path'
import _ from 'lodash'
import sqlite from 'sqlite3'

const CREATE_TABLE_QUERY = `
PRAGMA encoding = "UTF-8";

CREATE TABLE IF NOT EXISTS paths (
  path TEXT PRIMARY KEY,
  hash TEXT
);

CREATE TABLE IF NOT EXISTS tags (
  tag TEXT,
  hash TEXT
);
`

const REMOVE_PATH_QUERY = `
DELETE FROM paths WHERE path = '%s'
`

const INSERT_PATH_QUERY = `
INSERT INTO paths 
SELECT '%s', '%s'
WHERE (SELECT COUNT(*) FROM paths WHERE path = '%s') = 0
`

const INSERT_TAG_QUERY = `
INSERT INTO tags 
SELECT '%s', '%s'
WHERE (SELECT COUNT(*) FROM tags WHERE hash = '%s') = 0
`

const GET_ALL_PATH_QUERY = `
SELECT * FROM paths
`

const GET_ALL_PICTURES_QUERY = `
SELECT paths.hash, paths.path, T.tags
FROM paths
JOIN (SELECT hash, GROUP_CONCAT(tag, ' ') tags FROM tags GROUP BY hash) AS T
ON paths.hash = T.hash
`

const GET_PICTURE_QUERY = `
SELECT * FROM
(
  SELECT paths.hash, paths.path, T.tags
  FROM paths
  JOIN (SELECT hash, GROUP_CONCAT(tag, ' ') tags FROM tags GROUP BY hash) AS T
  ON paths.hash = T.hash
)
WHERE hash = '%s'
`

const SIZE_QUERY = `
SELECT COUNT(*) FROM paths
`

const HASH_BY_TAG_QUERY = `
SELECT hash FROM tags WHERE tag = '%s' GROUP BY hash
`

const HASHTAGS_BY_HASHES_QUERY = `
SELECT T1.hash, GROUP_CONCAT(tags.tag, ' ') tags
FROM tags
JOIN (%s) AS T1
ON T1.hash = tags.hash
GROUP BY T1.hash
`

const PICTURE_BY_HASHTAGS_QUERY = `
SELECT paths.hash, paths.path, T2.tags
FROM paths
JOIN (%s) AS T2
ON paths.hash = T2.hash
`

const ADD_TAG_QUERY = `
INSERT INTO tags 
SELECT '%s', '%s'
WHERE (SELECT COUNT(*) FROM tags WHERE tag = '%s' AND hash = '%s') = 0
`

const REMOVE_TAG_QUERY = `
DELETE FROM tags
WHERE tag = '%s' AND hash = '%s'
`

/**
 * call db function in promise
 * 
 * @param {sqlite3.Database} db 
 * @param {string} funcName 
 * @param {any[]} rest 
 * @returns {Promise<any>}
 */
function dbCall(db, funcName, ...rest) {
  return new Promise((resolve, reject) =>
    db[funcName](...rest, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  ).catch(err => console.error(err))
}

/**
 * used to monitor pictures of specified directory.
 *
 * @class Store
 */
class Store {
  /**
   * Creates an instance of Store.
   * @param {string} root
   * @memberof Store
   */
  constructor(root) {
    this.root = root
  }

  /**
   * scan whole directory
   *
   * 1. read current dir tree
   * 2. get debut files which is scaned for md5 and pushed into
   *    pictures and tags
   * 3. get vanished files which will be removed from pictures but
   *    staied in tags
   *
   * @memberof Store
   */
  async scan() {
    await this._setupDB()

    let db = this.db

    let files = await getFiles(this.root)
    let picFiles = _.filter(files, file => /\.jpg$|\.png$/.test(file))

    let pathsResult = await dbCall(db, 'all', GET_ALL_PATH_QUERY)
    let savedPaths = _.map(pathsResult, 'path')
    let debutFiles = _.difference(picFiles, savedPaths)
    let vanishedFiles = _.difference(savedPaths, picFiles)

    // scan debut files and push into pictures and tags
    await Promise.all(debutFiles.map(debutFile => this._scanPicture(debutFile)))

    // remove vanished files
    await Promise.all(
      vanishedFiles.map(vanishedFile =>
        dbCall(db, 'run', format(REMOVE_PATH_QUERY, vanishedFile))
      )
    )
  }

  /**
   * get all pictures
   * 
   * @returns {object[]}
   * @memberof Store
   */
  async all() {
    return await dbCall(this.db, 'all', GET_ALL_PICTURES_QUERY)
  }

  /**
   * add tag to hash
   * 
   * @param {string} hash 
   * @param {string} tag 
   * @memberof Store
   */
  async addTag (hash, tag){
    await dbCall(this.db, 'run', format(ADD_TAG_QUERY, tag, hash, tag, hash)) 
  }

  /**
   * remove tag from hash
   * 
   * @param {string} hash 
   * @param {string} tag 
   * @memberof Store
   */
  async removeTag (hash, tag){
    await dbCall(this.db, 'run', format(REMOVE_TAG_QUERY, tag, hash))
  }

  /**
   * get size of current store
   *
   * @returns {number}
   * @memberof Store
   */
  async size() {
    return await dbCall(this.db, 'get', SIZE_QUERY)
  }

  /**
   * search pictures of specified tags
   *
   * @param {string} [tags='']
   * @returns {object[]}
   * @memberof Store
   */
  async search(tags = '') {
    let db = this.db
    let words = _(tags)
      .split(/\s+/)
      .compact()
      .map(word => _.replace(word, '\'', '\'\''))
      .value()

    let hashesQuery = words
      .map(word => format(HASH_BY_TAG_QUERY, word))
      .join('\nINTERSECT\n')

    let hashTagsQuery = format(HASHTAGS_BY_HASHES_QUERY, hashesQuery)

    let pictureQuery = format(PICTURE_BY_HASHTAGS_QUERY, hashTagsQuery)

    let pics = await dbCall(db, 'all', pictureQuery)

    return pics
  }

  /**
   * get picture data using hash
   *
   * @param {string} hash
   * @returns {object}
   * @memberof Store
   * @private
   */
  async _getPicture(hash) {
    return await dbCall(this.db, 'get', format(GET_PICTURE_QUERY, hash))
  }

  /**
   * setup lowdb database
   *
   * @memberof Store
   */
  async _setupDB() {
    let dbPath = join(this.root, 'store.db')

    let db = new sqlite.Database(dbPath)
    await new Promise(resolve => db.exec(CREATE_TABLE_QUERY, resolve))

    this.db = db
  }

  /**
   * scan a specified picture
   *
   * @param {string} path
   * @memberof Store
   */
  async _scanPicture(path) {
    let db = this.db
    let realPath = join(this.root, path)
    let hash = await md5(realPath)

    // 1. write path-hash
    await dbCall(db, 'run', format(INSERT_PATH_QUERY, path, hash, path))

    // 2. write tags-hash if hash not found
    await dbCall(db, 'run', format(INSERT_TAG_QUERY, 'debut', hash, hash))
  }
}

/**
 * load a store
 *
 * @export
 * @param {any} root root path of store
 * @returns {Sotre}
 */
export async function load(root) {
  let store = new Store(root)
  await store.scan()
  return store
}

// (async () => {
//   let at = new Date()
//   let store = await load('tmp')
//   let bt = new Date()
//   await store.removeTag('923cf742b3de2b4e19614abca949d3a3', 'heiheihei')
//   console.log(await store.search('debut'))
//   let ct = new Date()
//   console.log(bt - at)
//   console.log(ct - bt)
// })()
