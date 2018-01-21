import Vue from 'vue'
import Vuex from 'vuex'
import { rpc } from './utils'
import { remote } from 'electron'
import _ from 'lodash'

Vue.use(Vuex)

/**
 * state store
 */
export const store = new Vuex.Store({
  state: {
    // current shwon page
    page: 'welcome',

    // theme for title, [ light, dark ]
    titleTheme: 'light',

    // loading progress
    loadingProgress: 0,

    // text for last searching 
    lastSearch: '',

    // search results
    pictures: [],

    // all existed tags
    tags: [],

    // detail modal
    detail: {
      show: false,

      // hash of currently chosen picture
      hash: ''
    },

    // tag list modal
    tagList: {
      show: false
    },

    // batch modal
    batch: {
      show: false,

      // if batch is executing
      executing: false
    }
  },

  getters: {
    // get currently chosen picture
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

    setLoadingProgress (state, { progress }){
      state.loadingProgress = progress
    },

    setLastSearch (state, { text }){
      state.lastSearch = text
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
            .compact()
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
            .compact()
            .join(' ')
        })
    },

    setTags (state, { tags }){
      state.tags = tags
    },

    setBatchState (state, payload){
      _.forOwn(payload, (value, key) => state[key] = value)
    }
  },

  actions: {
    loadStore ({ commit }) {
      let paths = remote.dialog.showOpenDialog({
        title: 'Choose album directory',
        properties: [ 'openDirectory' ]
      })

      // in case user cancel dialog
      if (!_.isArray(paths)){
        return 
      }

      // set timeout to finish transition
      setTimeout(() => rpc.call('store-open', { path: paths[0] }), 500)

      // reset delta time to ensure animation starting at begining
      setTimeout(() => commit('switchPage', { page: 'loading' }), 0)
    },

    scanProgress ({ commit }, { progress }){
      commit('setLoadingProgress', {
        progress: progress * 0.8
      })
    },

    rescanProgress ({ commit }, { progress }){
      commit('setLoadingProgress', {
        progress: 0.8 + progress * 0.2
      })
    },

    didLoadStore ({ commit }) {
      rpc.call('store-get-tags')
      commit('setLoadingProgress', { progress: 1 })

      // finish loading progress bar animation
      setTimeout(() => {
        commit('switchPage', { page: 'main' })
        commit('switchTitleTheme', { theme: 'dark' })
      }, 400)
    },

    search ({ commit }, { text }){
      if (!_.isString(text) || text.length === 0){
        return
      }

      commit('setLastSearch', { text })
      rpc.call('store-search', { words: text })
    },

    refreshSearch (){
      this.dispatch('search', { text: this.state.lastSearch })
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
      rpc.call('store-get-tags')
      commit('addTag', { tag, hash })
    },

    removeTag ({ commit }, { tag, hash }){
      if (!_.isString(tag) || tag.length === 0){
        return
      }

      // check if tag doesn't exists
      if (!tagExists(tag)){
        return
      }

      rpc.call('store-remove-tag', { tag, hash })
      rpc.call('store-get-tags')
      commit('removeTag', { tag, hash })

      // if no tag available, add special tag to avoid bug
      if (this.getters.detailPicture.tags.trim().length === 0){
        this.dispatch('addTag', { tag: 'no-tag', hash })
      }
    },

    openPicture (store, { path }){
      rpc.call('store-open-picture', { path })
    },

    toggleTagList ({ commit }){
      commit('toggleModal', { name: 'tagList' })
    },

    setTags ({ commit }, { tags }){
      commit('setTags', { tags })
    },

    toggleBatch ({ commit }){
      commit('toggleModal', { name: 'batch' })
    },

    runBatch ({ commit }, { contains, adds, removes }){
      contains = polishTags(contains)
      adds = polishTags(adds)
      removes = polishTags(removes)

      rpc.call('store-batch', { contains, adds, removes })

      // keep user waiting for finishing
      commit('setBatchState', { executing: true })
    },

    didBatch ({ commit }){
      commit('setBatchState', { executing: false })

      // refresh search to update tags
      this.dispatch('refreshSearch')

      this.dispatch('toggleBatch')
    }
  }
})

/**
 * clear odd spaces
 * 
 * @param {string} tags 
 * @returns {string}
 */
function polishTags (tags){
  return _(tags)
    .split(/\s+/)
    .compact()
    .join('\n')
}

/**
 * if tag exists in currently chosen picture
 * 
 * @param {string} tag 
 * @returns {bool}
 */
function tagExists(tag){
  let { tags } = store.getters.detailPicture
  return _(tags).split(/\s+/).indexOf(tag) !== -1
}

// listen store did open event
rpc.listen('store-did-open', () => {
  store.dispatch('didLoadStore')
})

// listen store scan progress event
rpc.listen('store-scan-progress', ({ progress }) => {
  store.dispatch('scanProgress', { progress })
})

// listen store rescan progress event
rpc.listen('store-rescan-progress', ({ progress }) => {
  store.dispatch('rescanProgress', { progress })
})

// listen store did search event
rpc.listen('store-did-search', ({ result }) => {
  store.dispatch('didSearch', { result })
})

// listen did get tags event
rpc.listen('store-did-get-tags', ({ tags }) => {
  store.dispatch('setTags', { tags })
})

// listen did batch event
rpc.listen('store-did-batch', () => {
  store.dispatch('didBatch')
})