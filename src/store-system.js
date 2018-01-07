import { register } from './manager'
import { rpc } from './utils'
import { load } from './store'
import serve from 'serve'
import _ from 'lodash'
import { SERVER_PORT } from '../app.config.json'

let store = null
let server = null

/**
 * expose api to rpc
 */
const system = {
  enter (){
    rpc.listen('store-open', async ({ path }) => {
      store = await load(path)

      if (server && _.isFunction(server.stop)){
        server.stop()
      }

      server = serve(path, {
        port: SERVER_PORT
      })

      rpc.call('store-did-open')
    })

    rpc.listen('store-search', async ({ words }) => {
      let result = await store.search(words)
      rpc.call('store-did-search', { result })
    })

    rpc.listen('store-add-tag', async ({ hash, tag }) => {
      await store.addTag(hash, tag)
    })

    rpc.listen('store-remove-tag', async ({ hash, tag }) => {
      await store.addTag(hash, tag)
    })
  },

  exit (){
    store = null

    if (server && _.isFunction(server.stop)){
      server.stop()
    }
    server = null
  }
}

register(system)