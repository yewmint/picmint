import express from 'express'
import { SERVER_PORT } from '../app.config.json'
import _ from 'lodash'

const app = express()

let server

export default {
  start (path = process.rootPath){
    app.use(express.static(path))
    server = app.listen(SERVER_PORT)
  },

  stop (){
    if (server){
      server.close()
      server = null
    }
  }
}
