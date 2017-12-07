import { combineReducers } from 'redux'

import { reducer as featureReducer } from './feature'

export const reducer = combineReducers({
  feature: featureReducer
})

export const actions = {}