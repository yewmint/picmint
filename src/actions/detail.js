import { handleActions, createActions } from 'redux-actions'
import { rpc } from '../utils'
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
    REMOVE_TAG: tag => ({ tag }),
    NEW_TAG: tag => ({ tag })
  }
})

export const reducer = handleActions({
  DETAIL: {
    SETUP: (state, { payload: { img } }) => {
      return Immutable.fromJS(state).set('img', img).toJS()
    },

    REMOVE_TAG: (state, { payload: { tag } }) => {
      let tags = _.without(state.img.tags.split(/\s+/), tag).join(' ')
      rpc.call('db-update-tags', ({ id: state.img.id, tags}))
      return Immutable.fromJS(state).setIn(['img', 'tags'], tags).toJS()
    },
    
    NEW_TAG: (state, { payload: { tag } }) => {
      let tags = _.uniq(_.concat(state.img.tags.split(/\s+/), tag)).join(' ')
      rpc.call('db-update-tags', ({ id: state.img.id, tags}))
      return Immutable.fromJS(state).setIn(['img', 'tags'], tags).toJS()
    }
  }
}, DEFAULT)