import { combineReducers } from 'redux'

import { reducer as featureR } from './feature'
import { reducer as detailR, actions as detailA } from './detail'
import { reducer as searchR, actions as searchA } from './search'
import { reducer as duplicateR, actions as duplicateA } from './duplicate'

export const reducer = combineReducers({
  feature: featureR,
  detail: detailR,
  search: searchR,
  duplicate: duplicateR
})

export const actions = {
  ...detailA,
  ...searchA,
  ...duplicateA
}