import React from 'react'
import classname from 'classname'
import { Transition } from 'react-transition-group'
import { MdAddCircleOutline, MdAutorenew } from 'react-icons/lib/md'
import { remote } from 'electron'
import PropTypes from 'prop-types'
import Page from './Page'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  import: {
    width: 1280,
    height: 680,
    display: 'grid',
    'justify-items': 'center',
    'align-items': 'center',
  },

  idle: {
    color: '#585858',
    cursor: 'pointer',
    'border-radius': 8,
    transition: 'background-color 200ms',
    padding: 8,
    '&:hover': {
      transition: 'background-color 200ms',
      'background-color': '#aaa'
    },
    '&:active': {
      transition: 'background-color 200ms',
      'background-color': '#888'
    }
  },
  
  loading: {
    color: '#585858',
    animation: 'rotate 2s infinite linear',
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

class Import extends React.Component {
  constructor (props){
    super(props)

    this.state = { state: 'idle' }
  }

  handleOpen (){
    let paths = remote.dialog.showOpenDialog({
      title: 'Choose directory of images',
      properties: [
        'openDirectory'
      ]
    })
    
    if (paths){
      this.setState({ state: 'loading' })
    }
  }

  renderIdle (){
    return (
      <div className={classes.idle} onClick={() => this.handleOpen()}>
        <MdAddCircleOutline size={64} />
      </div>
    )
  }

  renderLoading (){
    return (
      <div className={classes.loading} onClick={() => this.handleOpen()}>
        <MdAutorenew size={64} />
      </div>
    )
  }

  render (){
    let { state } = this.state

    let renders = {
      idle: () => this.renderIdle(),
      loading: () => this.renderLoading()
    }

    return (
      <div className={classes.import}>
        {renders[state]()}
      </div>
    )
  }
}

export default () => (
  <Page path="/import">
    <Import />
  </Page>
)