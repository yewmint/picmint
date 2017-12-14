import { handleActions, createActions } from 'redux-actions'
import _ from 'lodash'

const DEFAULT = {
  dups: {}
}

export const actions = createActions({
  DUPLICATE: {
    SETUP: dups => ({ dups }),
  }
})

export const reducer = handleActions({
  DUPLICATE: {
    SETUP: (state, { payload: { dups } }) => {
      return { dups }
    }
  }
}, DEFAULT)