import { combineReducers } from 'redux'

import { reducer as featureR } from './feature'
import { reducer as detailR, actions as detailA } from './detail'

export const reducer = combineReducers({
  feature: featureR,
  detail: detailR
})

export const actions = {
  ...detailA
}