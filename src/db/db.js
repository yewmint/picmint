import DB from 'better-sqlite3'
import sqlstr from 'sqlstring'
import _ from 'lodash'
import { format } from 'util'
import moment from 'moment'

import { DB_PATH } from '../../app.config.json'

const NUM_PER_ARCHIVE = 100

const sqlite = new DB(DB_PATH)

sqlite.prepare(`
PRAGMA encoding = "UTF-8"
`).run()

sqlite.prepare(`
CREATE TABLE IF NOT EXISTS images (
  id INT ROWID NOT NULL,
  archive INT,
  width INT,
  height INT,
  date TEXT,
  tags TEXT
)
`).run()

const MAX_ID_QUERY = `
SELECT MAX(id) maxId FROM images LIMIT 1
`

const SIZE_QUERY = `
SELECT COUNT(id) size FROM images
`

const RAND_QUERY = `
SELECT * FROM images ORDER BY RANDOM() LIMIT 
`

const SEARCH_QUERY = `
SELECT * FROM images WHERE
`

const INSERT_QUERY = `
INSERT INTO images VALUES(?, ?, ?, ?, ?, ?)
`

const UPDATE_QUERY = `
UPDATE images SET tags = %s WHERE id = %s
`

const GET_QUERY = `
SELECT * FROM images WHERE id = %d LIMIT 1
`

const db = {
  maxId (){
    // get() returns null if table is empty
    return sqlite.prepare(MAX_ID_QUERY).get()['maxId'] || 0
  },

  size (){
    return sqlite.prepare(SIZE_QUERY).get()['size']
  },

  random (size = 32){
    if (_.isNumber(size) && size > 0){
      let query = `${RAND_QUERY} ${size}`
      return sqlite.prepare(query).all()
    }
    else {
      return []
    }
  },

  search (words = ''){
    if (!_.isString(words)) return []

    let condition = words
      .split(/\s+/)
      .map(word => `INSTR(tags, ${sqlstr.escape(word)}) <> 0`)
      .join(' AND ')

    let query = `${SEARCH_QUERY} ${condition}`

    return sqlite.prepare(query).all()
  },

  insert ({ width, height, tags = '' }){
    let id = this.maxId() + 1
    let archive = _.ceil((this.size() + 1) / NUM_PER_ARCHIVE)
    let date = moment().format('MMM D, YYYY')

    try {
      let info = sqlite.prepare(INSERT_QUERY).run(
        id, archive, width, height, date, tags
      )

      return {
        id,
        archive,
        success: info.changes === 1
      }
    }
    catch (e){
      return { success: false, error: e.stack }
    }
  },

  updateTags (id, tags = ''){
    if (!_.isNumber(id) || id <= 0 || !_.isString(tags)){
      return { success: false }
    }

    tags = sqlstr.escape(tags)

    let query = format(UPDATE_QUERY, tags, id)

    try {
      let info = sqlite.prepare(query).run()
      return { success: info.changes === 1 }
    }
    catch (e){
      return { success: false, error: e.stack }
    }
  },

  getImg (id){
    if (!_.isNumber(id) || id <= 0){
      return { success: false, error: 'DB: Invalid id' }
    }

    let query = format(GET_QUERY, id)
    
    try {
      let img = sqlite.prepare(query).get()
      console.log(query)
      console.log(img)
      return { success: true, img }
    }
    catch (e){
      return { success: false, error: e.stack }
    }
  }
}

export default db