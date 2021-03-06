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
export function promisify(func) {
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
 * promisified mkdir
 *
 * @export
 */
export const mkdir = promisify(fs.mkdir)

// exclude for getFiles
const EXCLUDE_DIRS = ['.thumbs', 'System Volumn Information']

/**
 * get all file paths in a directory
 * recursively
 *
 * @export
 * @param {string} root root path of directory
 * @param {string} [path='.']
 * @returns {string[]} relative paths
 */
export async function getFiles(root, path = '.') {
  let curPath = join(root, path)

  if (!existsSync(curPath)) {
    return []
  }

  let status = await stat(curPath)

  if (status.isFile()) {
    return [{ path, size: status.size }]
  } else if (status.isDirectory()) {
    // if path is a hidden directory
    if (EXCLUDE_DIRS.indexOf(path) !== -1) {
      return []
    }

    let subpaths = await readdir(curPath)

    // parallelly search all sub paths
    let filesArray = await Promise.all(
      subpaths.map(subpath => getFiles(root, join(path, subpath)))
    )

    return _.concat(...filesArray)
  } else {
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
export async function md5(path) {
  if (!existsSync(path)) {
    return Promise.resolve('')
  }

  let hash = createHash('md5')
  let rstream = createReadStream(path)

  return new Promise(resolve => {
    rstream.on('readable', () => {
      const data = rstream.read()
      if (data) {
        hash.update(data)
      } else {
        rstream.close()
        resolve(hash.digest('hex'))
      }
    })
  })
}

/**
 * get file size of path
 *
 * @export
 * @param {string} path
 * @returns {number}
 */
export async function fileSize(path) {
  if (!existsSync(path)) {
    return Promise.resolve(-1)
  }

  let status = await stat(path)
  return status.size
}

/**
 * invoke map for async mapper
 *
 * @export
 * @param {object[]} array
 * @param {async function} mapper
 * @returns {Promise<any[]>}
 */
export async function asyncMap(array, mapper) {
  if (!_.isArray(array) || !_.isFunction(mapper)) {
    return Promise.resolve(null)
  }

  return await Promise.all(array.map(el => mapper(el)))
}

/**
 * format string using key-value pairs
 *
 * @export
 * @param {string} template
 * @param {object} data
 * @returns {string}
 */
export function format(template, data) {
  if (!_.isString(template) || !_.isObject(data)) {
    return null
  }

  let str = template
  _.forOwn(data, (value, key) => {
    // ensure replacing all occurance
    let reg = new RegExp(`\\$${key}`, 'g')
    str = str.replace(reg, value)
  })

  return str
}

/**
 * ensure dir exists
 */
export async function ensureDir(path) {
  if (!existsSync(path)) {
    await mkdir(path)
  }
}

/**
 * async invoke forEach on chunk of arr
 * progCb reflects progress
 *
 * @export
 * @param {any[]} arr
 * @param {number} chunkSize
 * @param {function} func
 * @param {function} progCb
 */
export async function asyncChunkForEach(arr, chunkSize, func, progCb) {
  if (!_.isArray(arr) || !_.isNumber(chunkSize) || !_.isFunction(func)) {
    return Promise.resolve(null)
  }

  let chunks = _.chunk(arr, chunkSize)
  let len = chunks.length

  let index = 0
  for (let chunk of chunks) {
    await asyncMap(chunk, func)

    if (_.isFunction(progCb)) {
      progCb(++index / len)
    }
  }
}

/**
 * listen rpc in main process
 *
 * @param {string} [eventName='default']
 * @param {any} [func=_.noop]
 */
function mainListen(eventName = 'default', func = _.noop) {
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
function mainCall(eventName = 'default', args = {}) {
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
function mainCallSync(eventName = 'default', args = {}) {
  eventName = 'rpc-' + eventName
  return webContents.getAllWebContents()[0].sendSync(eventName, args)
}

/**
 * listen rpc in renderer process
 *
 * @param {string} [eventName='default']
 * @param {any} [func=_.noop]
 */
function rendererListen(eventName = 'default', func = _.noop) {
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
function rendererCall(eventName = 'default', args = {}) {
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
function rendererCallSync(eventName = 'default', args = {}) {
  eventName = 'rpc-' + eventName
  return ipcRenderer.sendSync(eventName, args)
}

/**
 * take proxy to delegate
 */
let proxy
if (process.type === 'browser') {
  proxy = {
    listen: mainListen,
    call: mainCall,
    callSync: mainCallSync
  }
} else if (process.type === 'renderer') {
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
