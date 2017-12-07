import { createStore } from 'redux'
import { reducer } from './actions'

const store = createStore(reducer)
export default store