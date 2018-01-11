/**
 * @file store.js
 * @author yewmint
 */

import { getFiles, md5, fileSize, asyncMap, format } from './utils'
import { join } from 'path'
import winston from 'winston'
import _ from 'lodash'
import sqlite from 'sqlite3'
import { SERVER_PORT } from '../app.config.json'

const CREATE_TABLE_QUERY = `
PRAGMA encoding = "UTF-8";

CREATE TABLE IF NOT EXISTS paths (
  path TEXT PRIMARY KEY,
  size INT,
  hash TEXT
);

CREATE TABLE IF NOT EXISTS tags (
  tag TEXT,
  hash TEXT
);
`

const REMOVE_PATH_QUERY = `
DELETE FROM paths WHERE path = '$path'
`

const INSERT_PATH_QUERY = `
INSERT INTO paths 
SELECT '$path' path, '$size' size, '$hash' hash
WHERE NOT EXISTS (SELECT * FROM paths WHERE path = '$path' LIMIT 1)
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

const SIZE_QUERY = `
SELECT COUNT(*) size FROM paths
`

const HASH_BY_TAG_QUERY = `
SELECT hash FROM tags WHERE tag = '$tag' GROUP BY hash
`

const HASHTAGS_BY_HASHES_QUERY = `
SELECT T1.hash, GROUP_CONCAT(tags.tag, ' ') tags
FROM tags
JOIN ($subquery) AS T1
ON T1.hash = tags.hash
GROUP BY T1.hash
`

const PICTURE_BY_HASHTAGS_QUERY = `
SELECT paths.hash, paths.path, T2.tags
FROM paths
JOIN ($subquery) AS T2
ON paths.hash = T2.hash
`

const DEBUT_TAG_QUERY = `
INSERT INTO tags 
SELECT 'debut' tag, '$hash' hash
WHERE NOT EXISTS (SELECT * FROM tags WHERE hash = '$hash' LIMIT 1)
`

const ADD_NO_TAG_QUERY = `
INSERT INTO tags 
SELECT 'no-tag' tag, '$hash' hash
WHERE NOT EXISTS (SELECT * FROM tags WHERE hash = '$hash' LIMIT 1)
`

const ADD_TAG_QUERY = `
INSERT INTO tags 
SELECT '$tag' tag, '$hash' hash
WHERE NOT EXISTS (
  SELECT * FROM tags WHERE tag = '$tag' AND hash = '$hash' LIMIT 1
)
`

const REMOVE_TAG_QUERY = `
DELETE FROM tags
WHERE tag = '$tag' AND hash = '$hash'
`

const EXISTS_PATH_SIZE_QUERY = `
SELECT 1 
WHERE EXISTS(
  SELECT * FROM paths WHERE path = '$path' AND size = $size LIMIT 1
)
`

const UPDATE_PATH_QUERY = `
UPDATE paths SET hash = '$hash', size = '$size' WHERE path = '$path'
`

const TAGS_QUERY = `
SELECT tag FROM tags GROUP BY tag
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
  ).catch(err => {
    winston.error(err)
    winston.error(funcName, ...rest)
  })
}

/**
 * monitor pictures of specified directory.
 * features:
 *  1. diffs directory with high performance using size cache and hash
 *  2. provides tag system to manage and look up pictures
 *  3. same tags provided for duplicate pictures
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
   * scan directory
   *
   * 1. diff current dir tree
   * 2. debut files are scanned for md5 and size,
   *    and pushed into database
   * 3. vanished files are removed from 'paths' table,
   *    yet tag-hash remained for next appearence
   * 4. other files are rescanned if size doesn't match
   *
   * @memberof Store
   */
  async scan() {
    await this._setupDB()

    let db = this.db

    let existFiles = await this._scanFolder (this.root)
    let savedFiles = await dbCall(db, 'all', GET_ALL_PATH_QUERY)

    let debutFiles = _.differenceBy(existFiles, savedFiles, 'path')
    let vanishedFiles = _.differenceBy(savedFiles, existFiles, 'path')
    let otherFiles = _.intersectionBy(existFiles, savedFiles, 'path')

    // scan debut files and push into pictures and tags
    await asyncMap(
      debutFiles, 
      async debutFile => {
        await this._scanPicture(debutFile)
      }
    )

    // remove vanished files
    await asyncMap(
      vanishedFiles,
      async ({ path }) => {
        await dbCall(db, 'run', format(REMOVE_PATH_QUERY, { path }))
      }
    )

    // rescan existed files
    await asyncMap(
      otherFiles,
      async otherFile => {
        await this._rescanPicture(otherFile)
      }
    )
  }

  /**
   * get all pictures
   * 
   * @returns {object[]}
   * @memberof Store
   */
  async all() {
    let pictures = await dbCall(this.db, 'all', GET_ALL_PICTURES_QUERY)
    return this._withUrl(pictures)
  }

  /**
   * add tag to hash
   * 
   * @param {string} hash 
   * @param {string} tag 
   * @memberof Store
   */
  async addTag (hash, tag){
    await dbCall(this.db, 'run', format(ADD_TAG_QUERY, { tag, hash }))
  }

  /**
   * remove tag from hash
   * 
   * @param {string} hash 
   * @param {string} tag 
   * @memberof Store
   */
  async removeTag (hash, tag){
    await dbCall(this.db, 'run', format(REMOVE_TAG_QUERY, { tag, hash }))
  }

  /**
   * get size of current store
   *
   * @returns {number}
   * @memberof Store
   */
  async size() {
    let result = await dbCall(this.db, 'get', SIZE_QUERY)
    return result.size
  }

  /**
   * search pictures of specified tags
   *
   * @param {string} [text='']
   * @returns {object[]}
   * @memberof Store
   */
  async search(text = '') {
    let db = this.db

    // tags are separated by space char
    // escape single quote of sql
    let tags = _(text)
      .split(/\s+/)
      .compact()
      .map(word => _.replace(word, '\'', '\'\''))
      .value()

    // construct query
    // 1. query to select hash containing all tags
    let hashesQuery = tags
      .map(tag => format(HASH_BY_TAG_QUERY, { tag }))
      .join('\nINTERSECT\n')

    // 2. query to concat tags of hash
    let hashTagsQuery = format(
      HASHTAGS_BY_HASHES_QUERY, { subquery: hashesQuery }
    )

    // 3. query to join path and tag
    let pictureQuery = format(
      PICTURE_BY_HASHTAGS_QUERY, { subquery: hashTagsQuery }
    )

    let pics = await dbCall(db, 'all', pictureQuery)

    return this._withUrl(pics)
  }

  /**
   * get all tags
   * 
   * @returns {string[]}
   * @memberof Store
   */
  async getTags (){
    let result = await dbCall(this.db, 'all', TAGS_QUERY)
    return _.map(result, 'tag')
  }

  /**
   * get hashes by tags
   * 
   * @param {string} [tags=''] 
   * @returns {string[]}
   * @memberof Store
   */
  async getHash (tags = ''){
    if (tags.trim().length === 0){
      return []
    }

    let db = this.db

    let hashQuery = _(tags)
      .split(/\s+/)
      .compact()
      .map(tag => format(HASH_BY_TAG_QUERY, { tag }))
      .join('\nINTERSECT\n')
    
    return _.map(await dbCall(db, 'all', hashQuery), 'hash')
  }

  /**
   * batch task
   * remove 'removes' and add 'adds' into pictures containing 'contains'
   * 
   * @param {string} contains 
   * @param {string} adds 
   * @param {string} removes 
   * @memberof Store
   */
  async batch (contains = '', adds = '', removes = ''){
    let hashes = await this.getHash(contains)
    let addTags = _(adds).split(/\s+/).compact().value()
    let removeTags = _(removes).split(/\s+/).compact().value()

    await asyncMap(hashes, async hash => {
      await asyncMap(addTags, async tag => await this.addTag(hash, tag))
      await asyncMap(removeTags, async tag => await this.removeTag(hash, tag))
      await dbCall(this.db, 'run', format(ADD_NO_TAG_QUERY, { hash }))
    })
  }

  /**
   * setup lowdb database
   *
   * @memberof Store
   */
  async _setupDB() {
    if (_.isObject(this.db) && _.isFunction(this.db.close)){
      await new Promise(resolve => this.db.close(resolve))
    }

    let dbPath = join(this.root, 'store.db')

    let db = new sqlite.Database(dbPath)
    await dbCall(db, 'exec', CREATE_TABLE_QUERY)

    this.db = db
  }

  /**
   * scan a specified picture
   *
   * @param {object} file
   * @memberof Store
   */
  async _scanPicture({ path, size }) {
    let db = this.db
    let realPath = join(this.root, path)
    let hash = await md5(realPath)

    // 1. write path
    await dbCall(db, 'run', format(INSERT_PATH_QUERY, { path, hash, size }))

    // 2. write debut hash if debut
    await dbCall(db, 'run', format(DEBUT_TAG_QUERY, { hash }))
  }

  /**
   * rescan existed file,
   * update hash if size doesn't match record from database
   * 
   * @param {object} file 
   * @memberof Store
   */
  async _rescanPicture ({ path }){
    let db = this.db
    let realPath = join(this.root, path)
    let size = await fileSize(realPath)

    let exist = await dbCall(
      db, 
      'get', 
      format(EXISTS_PATH_SIZE_QUERY, { path, size })
    )

    // if size doesn't match
    if (!exist){
      let hash = await md5(realPath)

      // 1. update hash of path
      await dbCall(db, 'run', format(UPDATE_PATH_QUERY, { hash, path, size }))

      // 2. write debut hash if debut
      await dbCall(db, 'run', format(DEBUT_TAG_QUERY, { hash }))
    }
  }

  /**
   * scan folder to get all pictures
   * 
   * @param {string} path 
   * @returns {object}
   * @memberof Store
   */
  async _scanFolder (path){
    let allPaths = await getFiles(path)
    let picPaths = _.filter(allPaths, file => /\.jpg$|\.png$/i.test(file))

    return await asyncMap(
      picPaths, 
      async path => ({ 
        path, 
        size: await fileSize(join(this.root, path)) 
      })
    )
  }

  /**
   * attach url to each picture
   * 
   * @param {object[]} pictures 
   * @returns {object[]}
   * @memberof Store
   */
  _withUrl (pictures) {
    pictures.forEach(pic => {
      pic.url = `http://127.0.0.1:${SERVER_PORT}/${pic.path}`
    })

    return pictures
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
//   console.log(bt - at)
  
//   // winston.log(await store.all())
//   // await store.addTag('cc43840a3635933be43f13d0e3a5af2e', 'window')
//   // await store.removeTag('cc43840a3635933be43f13d0e3a5af2e', 'window')
//   // winston.log(await store.size())
//   // winston.log(await store.search('window debut'))
//   await store.batch('window glow', 'kkk wkk', 'kk')
// })()
