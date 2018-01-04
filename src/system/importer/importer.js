import copy from './copy'
import rimraf from 'rimraf'
import { db } from '../db'
import { resolve, basename } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import _ from 'lodash'
import { rpc } from '../../utils'

function rmrf(path) {
  if (!existsSync(path)) {
    return
  }

  try {
    rimraf.sync(path, { maxBusyTries: 40 })
    return true
  }
  catch (e){
    // console.error(e)
    return false
  }
}

const THRESHOLD = 1

const tmpPath = resolve(process.rootPath, './app/store/tmp')
const picPath = resolve(
  process.rootPath, './app/store/tmp/pics'
)
const thbPath = resolve(
  process.rootPath, './app/store/tmp/thumbs'
)

function distance (fpa, fpb){
  let binStrA = _.padStart(Number.parseInt(fpa, 16).toString(2), 64, '0')
  let binStrB = _.padStart(Number.parseInt(fpb, 16).toString(2), 64, '0')

  let dis = _.range(0, 63).reduce(
    (prev, i) => prev + (binStrA[i] === binStrB[i] ? 0 : 1)
  , 0)

  return dis
}

function moveImg (id, archive, img){
  let picArchPath = resolve(
    process.rootPath, `./app/store/pics/${archive}`
  )
  if (!existsSync(picArchPath)) mkdirSync(picArchPath)

  let thbArchPath = resolve(
    process.rootPath, `./app/store/thumbs/${archive}`
  )
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
    rmrf(tmpPath)

    if (!existsSync(tmpPath)) mkdirSync(tmpPath)
    if (!existsSync(picPath)) mkdirSync(picPath)
    if (!existsSync(thbPath)) mkdirSync(thbPath)

    // copy all images into picPath
    let files = copy(path, picPath)

    // create thumbnails and extract metas from images in tmpPath/pics
    let newImgs = await process(tmpPath, files)

    let imgs = db.all()
    let dups = {}

    // search for duplicates
    newImgs.forEach(nimg => {
      nimg.tmpId = Number.parseInt(basename(nimg.path, '.jpg'))      

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

          // uid used to classify each img in duplicates
          dupImg.uid = `old/${dupImg.id}`
        }

        nimg.uid = `new/${nimg.tmpId}`
        dups[dupImg.fingerprint].push(nimg)
      }
      else {
        imgs = _.concat(imgs, nimg)
      }
    })

    // unique image does not own an archive and has not been marked as dup
    _.filter(imgs, img => !_.has(img, 'archive') && !img.dup).forEach(img => {
      let { id, archive } = db.insert(img)
      moveImg(id, archive, img)
    })

    rpc.mainCallAsync('duplicate-setup', dups)
  },

  handleChoose (chosens, dups) {
    _.forOwn(dups, imgs => {
      let head = imgs[0]
      if (_.has(head, 'archive') && 
        _.findIndex(chosens, ({ uid }) => uid === head.uid) === -1
      ){
        // head image is old and not chosen
        db.remove(head.id)
      }
    })

    chosens.forEach(chosen => {
      if (!_.has(chosen, 'archive')){
        // chosen image is new
        let { id, archive } = db.insert(chosen)
        moveImg(id, archive, chosen)
      }
    })

    rmrf(tmpPath)
    rpc.mainCallAsync('duplicate-finish')
  },

  handleCancel () {
    rmrf(tmpPath)
    rpc.mainCallAsync('duplicate-finish')
  }
}

const wrapper = {
  enter (){
    rpc.listen('importer-import', (path) => {
      importer.importImages(path)
    })

    rpc.listen('importer-choose', ({ chosens, dups }) => {
      importer.handleChoose(chosens, dups)
    })

    rpc.listen('importer-cancel', () => {
      importer.handleCancel()
    })

    rmrf(tmpPath)
  },

  leave (){
    rmrf(tmpPath)
  }
}

export default wrapper

// importer.importImages('C:\\Users\\vane\\Pictures\\test\\pics')