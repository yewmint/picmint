/**
 * @file utils.js
 * @author yewmint
 */

import _ from 'lodash'
import { promisify } from 'util'
import fs, { createReadStream, existsSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

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

// (async () => console.log(await getFiles('src')))()