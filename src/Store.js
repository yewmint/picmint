/**
 * @file Store.js
 * @author yewmint
 */

import { getFiles, md5 } from './utils'
import { join } from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import _ from 'lodash'

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
  constructor (root){
    this.root = root
    this._setupDB()
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
  async scan (){
    let db = this.db

    let files = await getFiles(this.root)
    let picFiles = _.filter(
      files, 
      file => /\.jpg$|\.png$/.test(file)
    )

    let savedPaths = db.get('pictures').map('path').value()
    let debutFiles = _.difference(picFiles, savedPaths)
    let vanishedFiles = _.difference(savedPaths, picFiles)

    // scan debut files and push into pictures and tags
    await Promise.all(
      debutFiles.map(debutFile => this._scanPicture(debutFile))
    )

    // remove vanished files
    vanishedFiles.forEach(
      vanishedFile => db.get('pictures').remove({ path: vanishedFile }).write()
    )
  }

  /**
   * get size of current store
   * 
   * @returns {number}
   * @memberof Store
   */
  size (){
    return this.db.get('pictures').size().value()
  }

  /**
   * search pictures of specified tags
   * 
   * @param {string} [tags=''] 
   * @returns {object[]}
   * @memberof Store
   */
  search (tags = ''){
    let db = this.db
    let words = _(tags).split(/\s+/).compact().value()

    // get hashes of matching tag
    let hashes = db.get('tags').filter(
      ({ tags }) => _(words).map(word => tags.includes(word)).every(Boolean)
    ).map('hash').value()

    let pics = _.map(
      hashes,
      hash => this._getPicture(hash)
    )

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
  _getPicture (hash){
    let db = this.db

    let path = db.get('pictures').find({ hash }).value().path
    let tags = db.get('tags').find({ hash }).value().tags

    return { hash, path, tags }
  }

  /**
   * setup lowdb database
   * 
   * @memberof Store
   */
  _setupDB (){
    let dbPath = join(this.root, 'store.json')
    let adapter = new FileSync(dbPath)

    let db = low(adapter)
    db.defaults({ pictures: [], tags: [] }).write()

    this.db = db
  }

  /**
   * scan a specified picture
   * 
   * @param {string} path 
   * @memberof Store
   */
  async _scanPicture (path){
    let db = this.db
    let realPath = join(this.root, path)
    let hash = await md5(realPath)

    // 1. write path-hash
    db.get('pictures').push({ path, hash }).write()

    // 2. write tags-hash if hash not found
    let tag = db.get('tags').find({ hash }).value()
    if (!tag){
      this.db.get('tags').push({ hash, tags: 'debut' }).write()
    }
  }
}

/**
 * load a store
 * 
 * @export
 * @param {any} root root path of store
 * @returns {Sotre}
 */
export async function load (root){
  let store = new Store(root)
  await store.scan()
  return store
}

// (async () => {
//   let at = new Date
//   let store = await load('tmp')
//   let bt = new Date
//   store.search('debut')
//   let ct = new Date
//   console.log(bt - at)
//   console.log(ct - bt)
// })()