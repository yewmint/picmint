import { createStore } from 'redux'
import { reducer } from './actions'

const store = createStore(reducer)
export default store

window.store =store
// setInterval(
//   () => console.log('store: ', store.getState()),
//   2000
// )