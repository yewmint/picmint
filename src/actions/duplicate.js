import { handleActions, createActions } from 'redux-actions'
import _ from 'lodash'

const DEFAULT = {
  dups: {},
  chosens: []
}

export const actions = createActions({
  DUPLICATE: {
    SETUP: dups => ({ dups }),
    CHOOSE: img => ({ img }),
    UNCHOOSE: img => ({ img }),
  }
})

export const reducer = handleActions({
  DUPLICATE: {
    SETUP: (state, { payload: { dups } }) => {
      // make old images chosen
      let chosens = []
      _.forOwn(dups, ([ head ]) => {
        if (head && _.has(head, 'archive')) {
          chosens.push(head)
        }
      })

      return { ...state, dups, chosens }
    },
    CHOOSE: (state, { payload: { img } }) => {
      return { ...state, chosens: _.concat(state.chosens, img) }
    },
    UNCHOOSE: (state, { payload: { img } }) => {
      return { ...state, chosens: _.without(state.chosens, img) }
    },
  }
}, DEFAULT)