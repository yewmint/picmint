import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './components/App.vue'

Vue.use(Vuex)

new Vue({
  el: '#root',
  render: h => h(App)
})
