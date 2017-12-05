import React from 'react'
import classname from 'classname'
import { Transition } from 'react-transition-group'
import PropTypes from 'prop-types'
import Page from './Page'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

export default class Import extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    return (
      <Page path="/import">
        <p>This is a Import Page</p>
      </Page>
    )
  }
}