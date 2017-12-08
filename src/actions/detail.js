import { handleActions, createActions } from 'redux-actions'
import _ from 'lodash'
import Immutable from 'immutable'

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
    SETUP: img => ({ img }),
    REMOVE_TAG: tag => ({ tag })
  }
})

export const reducer = handleActions({
  DETAIL: {
    SETUP: (state, { payload: { img } }) => {
      return Immutable.fromJS(state).set('img', img).toJS()
    },

    REMOVE_TAG: (state, { payload: { tag } }) => {
      let tags = state.img.tags
      let ntags = tags.replace(new RegExp(`\\s*${tag}\\s*`), ' ')
      let nstate = Immutable.fromJS(state).setIn(['img', 'tags'], ntags).toJS()
      return nstate
    }
  }
}, DEFAULT)