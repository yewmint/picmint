/**
 * @file store.js
 * @author yewmint
 */

import { 
  getFiles, 
  md5, 
  asyncMap, 
  format, 
  ensureDir, 
  asyncChunkForEach 
} from './utils'

import { existsSync } from 'fs'
import { join } from 'path'
import { cpus } from 'os'
import url from 'url'
import { logger } from './log'
// import winston from 'winston'
import _ from 'lodash'
import sqlite from 'sqlite3'
import sharp from 'sharp'
// import { SERVER_PORT } from '../app.config.json'

sharp.cache(false)

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
    logger.error('ERROR in dbCall', { ...rest, funcName, err })
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
   * @param {function} scanProgress callback for progress of scan
   * @param {function} rescanProgress callback for progress of rescan
   */
  async scan(scanProgress, rescanProgress) {
    await this._setupDB()
    let db = this.db

    let tsa = new Date

    this.thumbDir = join(this.root, '.thumbs/')
    await ensureDir(this.thumbDir)

    let existFiles = await this._scanFolder (this.root)
    let savedFiles = await dbCall(db, 'all', GET_ALL_PATH_QUERY)
    
    let tsb = new Date

    let debutFiles = _.differenceBy(existFiles, savedFiles, 'path')
    let vanishedFiles = _.differenceBy(savedFiles, existFiles, 'path')
    let modifiedFiles = _.filter(existFiles, file => {
      return _.find(savedFiles, ({ path, size }) => (
        file.path === path && file.size !== size
      ))
    })

    let tsc = new Date
    // scan debut files and push into pictures and tags
    await asyncChunkForEach(
      debutFiles,
      cpus().length,
      async debutFile => {
        await this._scanPicture(debutFile)
      },
      scanProgress
    )

    let tsd = new Date
    // remove vanished files
    await asyncChunkForEach(
      vanishedFiles,
      cpus().length,
      async ({ path }) => {
        await dbCall(db, 'run', format(REMOVE_PATH_QUERY, { path }))
      }
    )

    let tse = new Date
    // console.log(modifiedFiles.length)
    // rescan existed files
    await asyncChunkForEach(
      modifiedFiles,
      cpus().length,
      async file => {
        await this._rescanPicture(file)
      },
      rescanProgress
    )
    
    let tsf = new Date

    console.log(`b: ${tsb - tsa}ms`)
    console.log(`c: ${tsc - tsb}ms`)
    console.log(`d: ${tsd - tsc}ms`)
    console.log(`e: ${tse - tsd}ms`)
    console.log(`f: ${tsf - tse}ms`)
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

    // 3. generate thumbnail
    await this._generateThumbnail({ path: realPath, hash })
  }


  async _generateThumbnail ({ path, hash }){
    let thumbPath = join(this.thumbDir, `${hash}.jpg`)

    // if thumbnail exist
    if (existsSync(thumbPath)){
      return
    }

    await sharp(path)
      .resize(160, 160)
      .min()
      .crop()
      .jpeg({ quality: 50 })
      .toFile(thumbPath)
  }

  /**
   * rescan existed file,
   * update hash if size doesn't match record from database
   * 
   * @param {object} file 
   * @memberof Store
   */
  async _rescanPicture ({ path, size }){
    let db = this.db
    let realPath = join(this.root, path)

    let hash = await md5(realPath)

    // 1. update hash of path
    await dbCall(db, 'run', format(UPDATE_PATH_QUERY, { hash, path, size }))

    // 2. write debut hash if debut
    await dbCall(db, 'run', format(DEBUT_TAG_QUERY, { hash }))

    // 3. generate thumbnail
    await this._generateThumbnail({ path: realPath, hash })
  }

  /**
   * scan folder to get all pictures
   * 
   * @param {string} path 
   * @returns {object}
   * @memberof Store
   */
  async _scanFolder (path){
    let allFiles = await getFiles(path)
    let picFiles = _.filter(allFiles, ({ path }) => /\.jpg$|\.png$/i.test(path))

    return picFiles
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
      let picUrl = url.format({
        pathname: join(this.root, pic.path),
        protocol: 'file:',
        slashes: true
      })

      let thumbUrl = url.format({
        pathname: join(this.thumbDir, `${pic.hash}.jpg`),
        protocol: 'file:',
        slashes: true
      })

      // trick to make url work in background-image: url()
      pic.url = _.replace(picUrl, /\\/g, '/')
      pic.thumbUrl = _.replace(thumbUrl, /\\/g, '/')
      
      // `http://127.0.0.1:${SERVER_PORT}/${pic.path}`
    })

    return pictures
  }
}

/**
 * load a store
 *
 * @export
 * @param {any} root root path of store
 * @param {function} scanProgress callback for progress of scan
 * @param {function} rescanProgress callback for progress of rescan
 * @returns {Sotre}
 */
export async function load(root, scanProgress, rescanProgress) {
  let store = new Store(root)
  await store.scan(scanProgress, rescanProgress)
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
