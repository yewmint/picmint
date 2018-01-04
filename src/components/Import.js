import React from 'react'
import classname from 'classname'
import { MdAddCircleOutline, MdAutorenew } from 'react-icons/lib/md'
import { actions } from '../actions'
import { connect } from 'react-redux'
import { remote } from 'electron'
import TopFade from './TopFade'
import Page from './Page'
import { Redirect } from 'react-router'
import { rpc } from '../utils'

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

let duplicateCallback = null
rpc.listen('duplicate-setup', (dups) => {
  if (duplicateCallback){
    duplicateCallback(dups)
  }
})

class Import extends React.Component {
  constructor (props){
    super(props)

    this.state = { state: 'idle' }

    duplicateCallback = (...args) => this.handleDuplicate(...args)
  }

  handleDuplicate (dups){
    this.setState({ state: 'duplicate' })
    this.props.setupDuplicate(dups)
  }

  handleOpen (){
    let paths = remote.dialog.showOpenDialog({
      title: 'Choose directory of images',
      properties: [
        'openDirectory'
      ]
    })
    
    if (paths){
      setTimeout(() => {
        this.setState({ state: 'loading' })
        rpc.callAsync('importer-import', paths[0])
      }, 0)
    }
  }

  renderIdle (){
    return (
      <TopFade>
        <div 
          className={classname(classes.idle)} 
          onClick={() => this.handleOpen()}
        >
          <MdAddCircleOutline size={64} />
        </div>
      </TopFade>
    )
  }

  renderLoading (){
    return (
      <TopFade>
        <div 
          className={classname(classes.loading)}
        >
          <MdAutorenew size={64} />
        </div>
      </TopFade>
    )
  }

  renderDuplicate (){
    return (
      <Redirect to="/duplicate" />
    )
  }

  render (){
    let { state } = this.state

    let renders = {
      idle: () => this.renderIdle(),
      loading: () => this.renderLoading(),
      duplicate: () => this.renderDuplicate()
    }

    return (
      <div className={classes.import}>
        {renders[state]()}
      </div>
    )
  }
}

const ConnectedImport = connect(
  null,
  dispatch => ({
    setupDuplicate: dups => dispatch(actions.duplicate.setup(dups))
  })
)(Import)

export default () => (
  <Page path="/import">
    <ConnectedImport />
  </Page>
)