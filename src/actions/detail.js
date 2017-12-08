import { handleActions, createActions } from 'redux-actions'

const DEFAULT = {
  img: {
    id: -1,
    archive: -1,
    width: 0,
    height: 0,
    date: '',
    tags: ''
  }
}

export const actions = createActions({
  DETAIL: {
  }
})

export const reducer = handleActions({
  DETAIL: {
  }
}, DEFAULT)