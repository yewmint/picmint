import _ from 'lodash'
import { format } from 'util'
import moment from 'moment'
import { rpc } from '../utils'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { DB_PATH } from '../../app.config.json'

const NUM_PER_ARCHIVE = 100

let dbData = []
if (existsSync(DB_PATH)){
  let content = readFileSync(DB_PATH, {encoding: 'utf-8'})
  dbData = _.concat([], JSON.parse(content))
}

function syncDB (){
  dbData = _.sortBy(dbData, 'id')
  let content = JSON.stringify(dbData)
  writeFileSync(DB_PATH, content, {encoding: 'utf-8'})
}

export const db = {
  all (){
    return dbData
  },

  maxId (){
    // _.max return 0 provided empty array
    return _.max(_.map(dbData, 'id')) || 0
  },

  size (){
    return dbData.length
  },

  random (size = 32){
    if (_.isNumber(size) && size > 0){
      return _.take(_.shuffle(dbData), size)
    }
    else {
      return []
    }
  },

  search (words = ''){
    if (!_.isString(words)) return []
    words = words.split(/\s+/)

    return _.filter(dbData, ({ tags }) => {
      let contains = words.map(word => _.includes(tags, word))
      return contains.reduce((pre, cur) => pre && cur, true)
    }) || []
  },

  insert ({ width, height, tags = 'new', fingerprint }){
    let id = this.maxId() + 1
    let archive = _.ceil((this.size() + 1) / NUM_PER_ARCHIVE)
    let date = moment().format('MMM D, YYYY')

    dbData = _.concat(dbData, {
      id, archive, width, height, date, tags, fingerprint
    })

    syncDB()
    return { id, archive }
  },

  remove (id) { 
    dbData = _.filter(dbData, line => line.id !== id)
    syncDB()
    return true
  },

  updateTags (id, tags = ''){
    if (!_.isNumber(id) || id <= 0 || !_.isString(tags)){
      return false
    }

    let line = _.find(dbData, ['id', id])
    if (line){
      line.tags = tags
      syncDB()
      return true
    }
    else {
      return false
    }
  },

  getImg (id){
    if (!_.isNumber(id) || id <= 0){
      return null
    }

    return _.find(dbData, ['id', id]) || null
  }
}

const wrapper = {
  enter (){
    rpc.listen('db-max-id', () => db.maxId())
    rpc.listen('db-size', () => db.size())
    rpc.listen('db-random', (size) => db.random(size))
    rpc.listen('db-search', (words) => db.search(words))
    rpc.listen('db-insert', (vals) => db.insert(vals))
    rpc.listen('db-update-tags', ({ id, tags }) => db.updateTags(id, tags))
    rpc.listen('db-get-img', (id) => db.getImg(id))
  },

  leave (){

  }
}

export default wrapper