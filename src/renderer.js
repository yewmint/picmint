import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'
import { remote } from 'electron'
import { Redirect } from 'react-router-dom'

const render = (Component, callback) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
    callback
  )
}

render(App, () => {
  remote.getCurrentWindow().show()
})

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => { 
    const NextApp = require('./components/App').default
    render(NextApp) 
  })
}