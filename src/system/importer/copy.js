import { 
  readdirSync, 
  statSync, 
  readFileSync, 
  writeFileSync, 
  existsSync ,
  mkdirSync
} from 'fs'

import { resolve } from 'path'
import _ from 'lodash'

function getImages (dirPath){
  let imgPaths = []

  if (!existsSync(dirPath)){
    return imgPaths
  }

  readdirSync(dirPath).forEach(subName => {
    let subPath = resolve(dirPath, subName)

    if (statSync(subPath).isDirectory()){
      imgPaths = _.concat(imgPaths, getImages(subPath))
    }
    else if (_.endsWith(subPath, '.png') || _.endsWith(subPath, '.jpg')){
      imgPaths = _.concat(imgPaths, subPath)
    }
  })

  return imgPaths
}

function copyTo (paths, dir){
  if (!existsSync(dir)){
    mkdirSync(dir)
  }

  let output = []
  paths.forEach((path, idx) => {
    let content = readFileSync(path)
    let writePath = resolve(dir, `${idx}.jpg`)
    writeFileSync(writePath, content)
    output = _.concat(output, writePath)
  })

  return output
}

function copyAllImgs (fromDir, toDir){
  let imgPaths = getImages(fromDir)
  return copyTo(imgPaths, toDir)
}

export default copyAllImgs