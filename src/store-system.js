/**
 * @file store-system.js
 * @author yewmint
 */

import { register } from './manager'
import { rpc } from './utils'
import { join } from 'path'
import { load } from './store'
// import serve from 'serve'
import _ from 'lodash'
import { exec } from 'child_process'
// import { SERVER_PORT } from '../app.config.json'

let store = null
let server = null

/**
 * expose store api to rpc
 */
const system = {
  enter (){
    rpc.listen('store-open', async ({ path }) => {
      store = await load(
        path,
        (progress) => rpc.call('store-scan-progress', { progress }),
        (progress) => rpc.call('store-rescan-progress', { progress })
      )

      // if (server && _.isFunction(server.stop)){
      //   server.stop()
      // }

      // // launch server for static files
      // // usually picture files
      // server = serve(path, {
      //   port: SERVER_PORT
      // })

      rpc.call('store-did-open')
    })

    // rpc.listen('store-search', async ({ words }) => {
    //   let result = await store.search(words)
    //   rpc.call('store-did-search', { result })
    // })

    rpc.listen('store-search-page', async ({ words, page, pageSize }) => {
      let result = await store.searchPage(words, page, pageSize)
      rpc.call('store-did-search-page', { result })
    })

    rpc.listen('store-get-picture', async ({ hash }) => {
      let picture = await store.getPicture(hash)
      rpc.call('store-did-get-picture', { picture })
    })

    rpc.listen('store-add-tag', async ({ hash, tag }) => {
      await store.addTag(hash, tag)
    })

    rpc.listen('store-remove-tag', async ({ hash, tag }) => {
      await store.removeTag(hash, tag)
    })

    // launch picture in default picture viewer
    rpc.listen('store-open-picture', async ({ path }) => {
      let imgPath = join(store.root, path)
      exec(`"${imgPath}"`)
    })

    rpc.listen('store-get-tags', async () => {
      let tags = await store.getTags()
      rpc.call('store-did-get-tags', { tags })
    })

    rpc.listen('store-batch', async ({contains, adds, removes}) => {
      await store.batch(contains, adds, removes)
      rpc.call('store-did-batch')
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