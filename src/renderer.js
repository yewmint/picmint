import 'babel-polyfill'
import { h, app } from 'hyperapp'
import App from './components/App'
import * as actions from './actions'

import './index.sass'

const state = {
  page: 'welcome',
  whiteTitle: false,
  pictures: [],
  detailPicture: null
}

const view = (state) => (
  <App {...state} />
)

let root = document.getElementById('root')

window.app = app(state, actions, view, root)
