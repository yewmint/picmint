import Vue from 'vue'
import Vuex from 'vuex'
import { rpc } from './utils'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    page: 'welcome',
    titleTheme: 'light'
  },

  mutations: {
    switchPage (state, { page }){
      state.page = page
    },

    switchTitleTheme (state, { theme }){
      state.titleTheme = theme
    }
  },

  actions: {
    loadStore ({ commit }, { path }) {
      setTimeout(() => rpc.call('store-open', { path }), 500)
      setTimeout(() => commit('switchPage', { page: 'loading' }), 0)
    },

    didLoadStore ({ commit }) {
      commit('switchPage', { page: 'main' })
      commit('switchTitleTheme', { theme: 'dark' })
    }
  }
})

// listen store did open event
rpc.listen('store-did-open', () => {
  store.dispatch('didLoadStore')
})