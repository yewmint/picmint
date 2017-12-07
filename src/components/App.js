import React from 'react'
import UI from './UI'
import { Provider } from 'react-redux'
import store from '../store'

export default class App extends React.Component {
  render (){
    return (
      <Provider store={store}>
        <UI />
      </Provider>
    )
  }
}
