import sharp from 'sharp'
import { basename, extname } from 'path'
import _ from 'lodash'
import { readdirSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

async function getFingerprint (path) {
  let data
  try {
    data = await sharp(path)
      .greyscale()
      .resize(8, 8)
      .raw()
      .toBuffer()
  }
  catch (e) {
    console.error(e.stack, path)
    return { success: false, error: e }
  }

  // to use sum, map and reduce
  let dataArr = [ ...data ]

  // get mean value to perform threshold
  let mean = _.sum(dataArr) / dataArr.length

  // threshold
  let fpArr = dataArr.map(val => val >= mean ? 1 : 0)

  // concat array into string
  let fpBinStr = fpArr.reduce((prev, val) => `${prev}${val}`)

  // convert binary string into hex string
  let fp = _.padStart(Number.parseInt(fpBinStr, 2).toString(16), 16, '0')

  return { success: true, fp }
}

async function getMetas (path){
  try {
    let data = await sharp(path)
      .metadata()

    return {
      success: true,
      width: data.width,
      height: data.height
    }
  }
  catch (e) {
    console.error(e.stack, path)
    return { success: false, error: e }
  }
}

async function createThumbnail (from, to){  
  try {
    await sharp (from)
      .resize(128, 128)
      .min()
      .crop(128, 128)
      .jpeg()
      .toFile(to)

    return { success: true }
  }
  catch (e) {
    console.error(e.stack, from)
    return { success: false, error: e }
  }
}

async function process(dirPath){
  let picDirPath = resolve(dirPath, 'pics')
  let thbDirPath = resolve(dirPath, 'thumbs')
  if (!existsSync(thbDirPath)){
    mkdirSync(thbDirPath)
  }

  let imgPaths = []
  readdirSync(picDirPath).forEach(subName => {
    let subPath = resolve(picDirPath, subName)
    if (_.endsWith(subPath, '.png') || _.endsWith(subPath, '.jpg')){
      imgPaths = _.concat(imgPaths, subPath)
    }
  })
  
  let imgs = []
  await Promise.all(imgPaths.map(async path => {
    let img = { path }
    let result

    result = await getMetas(path)
    if (result.success){
      img = { ...img, width: result.width, height: result.height }
    }

    result = await getFingerprint(path)
    if (result.success) {
      img = { ...img, fingerprint: result.fp }
    }

    let name = _.replace(basename(path), extname(path), '')
    let toPath = resolve(thbDirPath, `${name}.jpg`)
    result = await createThumbnail(path, toPath)
    if (result.success){
      img = { ...img, thumb: toPath }
    }

    imgs.push(img)
  }))

  return imgs
}

export default process
