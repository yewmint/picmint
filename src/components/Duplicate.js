import React from 'react'
import { connect } from 'react-redux'
import { actions } from '../actions'
import { Redirect } from 'react-router'
import { rpc } from '../utils'
import classname from 'classname'
import PropTypes from 'prop-types'
import DupGroup from './DupGroup'
import _ from 'lodash'
import Page from './Page'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  duplicate: {
    width: 1280,
    height: 680,
    padding: '10px 0',
    'overflow-y': 'auto',
  },

  button: {
    height: 32,
    margin: {
      left: 20,
    },
    padding: {
      left: 16,
      right: 16
    },
    'text-align': 'center',
    '-webkit-app-region': 'no-drag',
    'background-color': '#cccccc',
    border: 'none',
    cursor: 'pointer',
    'transition': 'background-color 100ms, color 100ms',
    '&:hover': {
      'background-color': '#aaa',
      'transition': 'background-color 100ms'
    },
  },

  confirm: {
    'background-color': '#1fb37c',
    color: 'white',
    'transition': 'background-color 100ms, color 100ms',
    '&:hover': {
      'background-color': '#24966c',
      'transition': 'background-color 100ms, color 100ms',
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

let finishCallback = null
rpc.listen('duplicate-finish', () => {
  if (_.isFunction(finishCallback)) {
    finishCallback()
  }
})

class Duplicate extends React.Component {
  static propTypes = {
    dups: PropTypes.object.isRequired,
    chosens: PropTypes.array.isRequired,  
  }

  constructor (props){
    super(props)

    this.state = { chosens: [], state: 'choosing' }
    finishCallback = () => this.handleFinish()
  }

  handleConfirm (){
    let { dups, chosens } = this.props

    rpc.callAsync('importer-choose', { dups, chosens })
  }

  handleCancel (){
    rpc.callAsync('importer-cancel')
  }

  handleFinish (){
    this.setState({ state: 'finished' })
  }

  render (){
    let { dups } = this.props
    let { state } = this.state

    if (state === 'finished' || _.keys(dups).length === 0){
      return (
        <Redirect to="/search" />
      )
    }

    return (
      <div className={classes.duplicate}>
        <div>
          <button 
            className={classname(classes.button, classes.confirm)} 
            onClick={() => this.handleConfirm()} 
          >
            Confirm
          </button>
          <button 
            className={classes.button} 
            onClick={() => this.handleCancel()} 
          >
            Cancel
          </button>
        </div>
        {
          _.toPairs(dups).map(([fp, group]) => (
            <DupGroup 
              key={fp} 
              imgs={group} 
              fingerprint={fp}
            />
          ))
        }
      </div>
    )
  }
}

const ConnectedDuplicate = connect(
  state => state.duplicate,
)(Duplicate)

export default () => (
  <Page path="/duplicate">
    <ConnectedDuplicate />
  </Page>
)