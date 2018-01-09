import Vue from 'vue'
import Vuex from 'vuex'
import { rpc } from './utils'
import { remote } from 'electron'
import _ from 'lodash'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    page: 'welcome',
    titleTheme: 'light',
    pictures: [],
    detail: {
      show: false,
      hash: ''
    },
    tagList: {
      show: false,
      tags: []
    }
  },

  getters: {
    detailPicture ({ pictures, detail: { hash } }){
      return _.find(pictures, { hash })
    }
  },

  mutations: {
    switchPage (state, { page }){
      state.page = page
    },

    switchTitleTheme (state, { theme }){
      state.titleTheme = theme
    },

    setPictures (state, { pictures }){
      state.pictures = pictures
    },

    setDetailHash (state, { hash }){
      state.detail.hash = hash
    },

    toggleModal (state, { name }) {
      state[name].show = !state[name].show
    },

    addTag (state, { hash, tag }){
      _(state.pictures)
        .filter({ hash })
        .forEach(picture => {
          picture.tags = _(picture.tags)
            .split(/\s+/)
            .push(tag)
            .join(' ')
        })
    },

    removeTag (state, { hash, tag }){
      _(state.pictures)
        .filter({ hash })
        .forEach(picture => {
          picture.tags = _(picture.tags)
            .split(/\s+/)
            .without(tag)
            .join(' ')
        })
    },

    setTags (state, { tags }){
      state.tagList.tags = tags
    }
  },

  actions: {
    loadStore ({ commit }) {
      let paths = remote.dialog.showOpenDialog({
        title: 'Choose album directory',
        properties: [ 'openDirectory' ]
      })

      if (!_.isArray(paths)){
        return 
      }

      setTimeout(() => rpc.call('store-open', { path: paths[0] }), 500)
      setTimeout(() => commit('switchPage', { page: 'loading' }), 0)
    },

    didLoadStore ({ commit }) {
      commit('switchPage', { page: 'main' })
      commit('switchTitleTheme', { theme: 'dark' })
    },

    search ({ commit }, { text }){
      if (!_.isString(text) || text.length === 0){
        return
      }

      rpc.call('store-search', { words: text })
    },

    didSearch ({ commit }, { result }){
      commit('setPictures', { pictures: result })
    },

    toggleDetail ({ commit }, { hash = '' } = {}) {
      commit('setDetailHash', { hash })
      commit('toggleModal', { name: 'detail' })
    },

    addTag ({ commit }, { tag, hash }){
      if (!_.isString(tag) || tag.length === 0){
        return
      }

      // preprocess tag to avoid space chars
      tag = _(_.toLower(tag)).split(/\s+/).compact().join('-')

      // check if tag exists
      if (tagExists(tag)){
        return
      }

      rpc.call('store-add-tag', { tag, hash })
      commit('addTag', { tag, hash })
    },

    removeTag ({ commit }, { tag, hash }){
      if (!_.isString(tag) || tag.length === 0){
        return
      }

      // check if tag exists
      if (!tagExists(tag)){
        return
      }

      rpc.call('store-remove-tag', { tag, hash })
      commit('removeTag', { tag, hash })
    },

    openPicture (store, { path }){
      rpc.call('store-open-picture', { path })
    },

    openTagList ({ commit }){
      rpc.call('store-get-tags')
      commit('toggleModal', { name: 'tagList' })
    },

    closeTagList ({commit}){
      commit('toggleModal', { name: 'tagList' })
    },

    setTags ({ commit }, { tags }){
      commit('setTags', { tags })
    }
  }
})

function tagExists(tag){
  let { tags } = store.getters.detailPicture
  return _(tags).split(/\s+/).indexOf(tag) !== -1
}

// listen store did open event
rpc.listen('store-did-open', () => {
  store.dispatch('didLoadStore')
})

// listen store did search event
rpc.listen('store-did-search', ({ result }) => {
  store.dispatch('didSearch', { result })
})

// listen did get tags event
rpc.listen('store-did-get-tags', ({ tags }) => {
  store.dispatch('setTags', { tags })
})