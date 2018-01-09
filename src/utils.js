/**
 * @file utils.js
 * @author yewmint
 */

import _ from 'lodash'
import fs, { createReadStream, existsSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'
import { ipcRenderer, ipcMain, webContents } from 'electron'

/**
 * implement util.promisify to polyfill node in electron
 * 
 * @export
 * @param {any} func 
 * @returns 
 */
export function promisify (func) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      func(...args, (err, value) => {
        if (err) reject(err)
        else resolve(value)
      })
    })
  }
}

/**
 * promisified readdir
 * 
 * @export
 */
export const readdir = promisify(fs.readdir)

/**
 * promisified stat
 * 
 * @export
 */
export const stat = promisify(fs.stat)

/**
 * promisified readFile
 * 
 * @export
 */
export const readFile = promisify(fs.readFile)

/**
 * get all file paths in a directory
 * recursively
 * 
 * @export
 * @param {string} root root path of directory
 * @param {string} [path='.'] 
 * @returns {string[]} relative paths
 */
export async function getFiles (root, path = '.'){
  let curPath = join(root, path)

  if (!existsSync(curPath)){
    return []
  }

  let status = await stat(curPath)

  if (status.isFile()){
    return [ path ]
  }
  else if (status.isDirectory()){
    let subpaths = await readdir(curPath)

    // parallelly search all sub paths
    let filesArray = await Promise.all(
      subpaths.map(subpath => getFiles(root, join(path, subpath)))
    )

    return _.concat(...filesArray)
  }
  else {
    return []
  }
}

/**
 * get md5 of file
 * 
 * @export
 * @param {string} path path to file
 * @returns {string}
 */
export async function md5 (path){
  if (!existsSync(path)){
    return Promise.resolve('')
  }

  let hash = createHash('md5')
  let rstream = createReadStream(path)

  return new Promise(resolve => {
    rstream.on('readable', () => {
      const data = rstream.read()
      if (data){
        hash.update(data)
      }
      else {
        rstream.close()
        resolve(hash.digest('hex'))
      }
    })
  })
}

export async function fileSize (path){
  if (!existsSync(path)){
    return Promise.resolve(-1)
  }

  let status = await stat(path)
  return status.size
}

export async function asyncMap (array, mapper){
  if (!_.isArray(array) || !_.isFunction(mapper)){
    return Promise.resolve(null)
  }

  return await Promise.all(array.map(el => mapper(el)))
}

export function format (template, data){
  if (!_.isString(template), !_.isObject(data)){
    return null
  }

  let str = template
  _.forOwn(
    data, 
    (value, key) => {
      // ensure replacing all occurance
      let reg = new RegExp(`\\$${key}`, 'g')
      str = str.replace(reg, value)
    }
  )

  return str
}

/**
 * listen rpc in main process
 * 
 * @param {string} [eventName='default'] 
 * @param {any} [func=_.noop] 
 */
function mainListen (eventName = 'default', func = _.noop){
  eventName = 'rpc-' + eventName
  ipcMain.on(eventName, (ev, arg) => {
    ev.returnValue = func(arg)
  })
}

/**
 * call rpc in main process
 * 
 * @param {string} [eventName='default'] 
 * @param {any} [args={}] 
 */
function mainCall (eventName = 'default', args = {}){
  eventName = 'rpc-' + eventName
  webContents.getAllWebContents()[0].send(eventName, args)
}

/**
 * call sync rpc in main process
 * 
 * @param {string} [eventName='default'] 
 * @param {any} [args={}] 
 * @returns 
 */
function mainCallSync (eventName = 'default', args = {}){
  eventName = 'rpc-' + eventName
  return webContents.getAllWebContents()[0].sendSync(eventName, args)
}

/**
 * listen rpc in renderer process
 * 
 * @param {string} [eventName='default'] 
 * @param {any} [func=_.noop] 
 */
function rendererListen (eventName = 'default', func = _.noop){
  eventName = 'rpc-' + eventName
  ipcRenderer.on(eventName, (ev, arg) => {
    ev.returnValue = func(arg)
  })
}

/**
 * call rpc in renderer process
 * 
 * @param {string} [eventName='default'] 
 * @param {any} [args={}] 
 */
function rendererCall (eventName = 'default', args = {}){
  eventName = 'rpc-' + eventName
  ipcRenderer.send(eventName, args)
}

/**
 * call sync rpc in renderer process
 * 
 * @param {string} [eventName='default'] 
 * @param {any} [args={}] 
 * @returns 
 */
function rendererCallSync (eventName = 'default', args = {}){
  eventName = 'rpc-' + eventName
  return ipcRenderer.sendSync(eventName, args)
}

/**
 * take proxy to delegate
 */
let proxy
if (process.type === 'browser'){
  proxy = { 
    listen: mainListen, 
    call: mainCall, 
    callSync: mainCallSync 
  } 
}
else if (process.type === 'renderer'){
  proxy = { 
    listen: rendererListen, 
    call: rendererCall, 
    callSync: rendererCallSync 
  } 
}

/**
 * perform rpc
 * 
 * @export
 */
export const rpc = proxy