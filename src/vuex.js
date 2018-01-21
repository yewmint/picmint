import Vue from 'vue'
import Vuex from 'vuex'
import { rpc } from './utils'
import { remote } from 'electron'
import _ from 'lodash'

const RESULT_PER_PAGE = 36

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

    // text for searching
    searchText: '',

    // page of serach result
    searchPage: 1,

    // total page of search result
    searchTotalPage: 1,

    // search results
    pictures: [],

    // all existed tags
    tags: [],

    // detail modal
    detail: {
      show: false,
      picture: null
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
    // // get currently chosen picture
    // detailPicture ({ pictures, detail: { hash } }){
    //   return _.find(pictures, { hash })
    // }
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

    setSearchText (state, { text }){
      state.searchText = text
    },

    setSearchPage (state, { page }) {
      state.searchPage = page
    },

    setSearchTotalPage (state, { totalPage }){
      state.searchTotalPage = totalPage
    },

    setPictures (state, { pictures }){
      state.pictures = pictures
    },

    setDetailPicture (state, { picture }){
      state.detail.picture = picture
    },

    toggleModal (state, { name }) {
      state[name].show = !state[name].show
    },

    addTag (state, { tag }){
      let pic = state.detail.picture
      pic.tags = _(pic.tags)
        .split(/\s+/)
        .push(tag)
        .compact()
        .join(' ')
    },

    removeTag (state, { tag }){
      let pic = state.detail.picture
      pic.tags = _(pic.tags)
        .split(/\s+/)
        .without(tag)
        .compact()
        .join(' ')
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

      commit('setSearchText', { text })
      this.dispatch('searchPage', { page: 1 })
    },

    searchPage ({ commit }, { page }){
      commit('setSearchPage', { page })
      rpc.call('store-search-page', { 
        words: this.state.searchText, 
        page,
        pageSize: RESULT_PER_PAGE
      })
    },

    refreshSearch (){
      this.dispatch('searchPage', { page: this.state.searchPage })
    },

    // didSearch ({ commit }, { result }){
    //   commit('setPictures', { pictures: result })
    // },

    didSearchPage ({ commit }, { result }){
      commit('setPictures', { pictures: result.pics })
      commit('setSearchTotalPage', { 
        totalPage: Math.ceil(result.total / RESULT_PER_PAGE)
      })
    },

    requestDetail ({ commit }, { hash }) {
      rpc.call('store-get-picture', { hash })
    },

    launchDetail ({ commit }, { picture }){
      commit('setDetailPicture', { picture })
      commit('toggleModal', { name: 'detail' })
    },

    closeDetail ({ commit }){
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
      commit('addTag', { tag })
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
      commit('removeTag', { tag })

      // if no tag available, add special tag to avoid bug
      if (this.state.detail.picture.tags.trim().length === 0){
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
  let { tags } = store.state.detail.picture
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

// listen store did open event
rpc.listen('store-did-get-picture', ({ picture }) => {
  store.dispatch('launchDetail', { picture })
})

// // listen store did search event
// rpc.listen('store-did-search', ({ result }) => {
//   store.dispatch('didSearch', { result })
// })

// listen store did search page event
rpc.listen('store-did-search-page', ({ result }) => {
  store.dispatch('didSearchPage', { result })
})

// listen did get tags event
rpc.listen('store-did-get-tags', ({ tags }) => {
  store.dispatch('setTags', { tags })
})

// listen did batch event
rpc.listen('store-did-batch', () => {
  store.dispatch('didBatch')
})