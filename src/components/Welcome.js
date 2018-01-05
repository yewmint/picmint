import { h } from 'hyperapp'
import FullPage from './FullPage'
import { remote } from 'electron'
import { rpc } from '../utils'
import _ from 'lodash'

const openStore = () => {
  let paths = remote.dialog.showOpenDialog({
    title: 'Choose directory of images',
    properties: [
      'openDirectory'
    ]
  })

  if (!_.isArray(paths)){
    return 
  }

  let path = paths[0]

  setTimeout(() => rpc.call('store-open', { path }), 500)

  setTimeout(() => window.app.switchPage('loading'), 0)
}

export default ({ name }) => (
  <FullPage name={name} center={true}>
    <div class="welcome">
      <h2>Choose a store to enjoy 🎵</h2>
      <button class="open-store" onclick={openStore}>
        <i class="material-icons">add</i>
      </button>
    </div>
  </FullPage>
)