/**
 * @file renderer.js
 * @author yewmint
 */

import 'babel-polyfill'
import Vue from 'vue'
import App from './components/App.vue'
import { store } from './vuex'

window.app = new Vue({
  el: '#root',
  store,
  render: h => h(App)
})
