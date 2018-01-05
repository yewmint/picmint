import { register } from './manager'
import { rpc } from './utils'
import { load } from './store'
import serve from 'serve'
import _ from 'lodash'
import { SERVER_PORT } from '../app.config.json'

let store = null
let server = null

const system = {
  enter (){
    rpc.listen('store-open', async ({ path }) => {
      store = await load(path)

      server = serve(path, {
        port: SERVER_PORT
      })

      rpc.call('store-did-open')
    })

    rpc.listen('store-search', ({ words }) => {
      let result = store.search(words)
      rpc.call('store-did-search', { result })
    })

    rpc.listen('store-size', () => {
      return store.size()
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