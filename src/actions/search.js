import { handleActions, createActions } from 'redux-actions'

const DEFAULT = {
  imgs: [],
  words: ''
}

export const actions = createActions({
  SEARCH: {
    UPDATE: ({imgs, words}) => ({ imgs, words })
  }
})

export const reducer = handleActions({
  SEARCH: {
    UPDATE: (state, { payload: { imgs, words } }) => {
      return { imgs, words }
    }
  }
}, DEFAULT)