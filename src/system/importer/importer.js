import copy from './copy'
import process from './process'
import { db } from '../db'
import { resolve } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import _ from 'lodash'
import { rpc } from '../../utils'

const THRESHOLD = 1

function distance (fpa, fpb){
  let binStrA = _.padStart(Number.parseInt(fpa, 16).toString(2), 64, '0')
  let binStrB = _.padStart(Number.parseInt(fpb, 16).toString(2), 64, '0')

  let dis = _.range(0, 63).reduce(
    (prev, i) => prev + (binStrA[i] === binStrB[i] ? 0 : 1)
  , 0)

  return dis
}

function moveImg (id, archive, img){
  let picArchPath = resolve(`dist/store/pics/${archive}`)
  if (!existsSync(picArchPath)) mkdirSync(picArchPath)

  let thbArchPath = resolve(`dist/store/thumbs/${archive}`)
  if (!existsSync(thbArchPath)) mkdirSync(thbArchPath)

  let picPath = resolve(picArchPath, `${id}.jpg`)
  let thbPath = resolve(thbArchPath, `${id}.jpg`)

  let content = readFileSync(img.path)
  writeFileSync(picPath, content)

  content = readFileSync(img.thumb)
  writeFileSync(thbPath, content)
}

const importer = {
  async importImages (path){
    let tmpPath = resolve('./dist/store/tmp')
    if (!existsSync(tmpPath)) mkdirSync(tmpPath)

    let picPath = resolve('./dist/store/tmp/pics')
    if (!existsSync(picPath)) mkdirSync(picPath)

    let thbPath = resolve('./dist/store/tmp/thumbs')
    if (!existsSync(thbPath)) mkdirSync(thbPath)

    // copy all images into picPath
    copy(path, picPath)

    // create thumbnails and extract metas fomr images in tmpPath/pics
    let newImgs = await process(tmpPath)

    let imgs = [ ...db.all() ]
    let dups = {}

    // search for duplicates
    newImgs.forEach(nimg => {
      let dupImg = _.find(
        imgs, 
        ({ fingerprint }) => distance(fingerprint, nimg.fingerprint) < THRESHOLD
      )

      if (dupImg){
        // create an array using finger print of first duplicate image
        if (!dups[dupImg.fingerprint]){
          dups[dupImg.fingerprint] = []
          dups[dupImg.fingerprint].push(dupImg)

          // flag to filter first duplicate out of imgs
          // cuz first duplicate will enter imgs being undetcted
          dupImg.dup = true
        }
        dups[dupImg.fingerprint].push(nimg)
      }
      else {
        imgs = _.concat(imgs, nimg)
      }
    })

    // unique image does not own an id and has not been marked as dup
    _.filter(imgs, img => !_.has(img, 'id') && !img.dup).forEach(img => {
      let { success, id, archive } = db.insert(img)
      if (success){
        moveImg(id, archive, img)
      }
    })

    _.forOwn(dups, (dupImgs, fp) => {
      console.log(fp, dupImgs)
    })

    rpc.mainCallAsync('duplicate-setup', dups)
  }
}

const wrapper = {
  enter (){
    rpc.listen('importer-import', (path) => {
      importer.importImages(path)
    })
  },

  leave (){

  }
}

export default wrapper

// importer.importImages('C:\\Users\\vane\\Pictures\\test\\pics')