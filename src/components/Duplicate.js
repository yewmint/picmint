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
    dups: PropTypes.object.isRequired
  }

  constructor (props){
    super(props)

    this.state = { chosens: [], state: 'choosing' }
    finishCallback = () => this.handleFinish()
  }

  handleConfirm (){
    let { dups } = this.props
    let { chosens } = this.state

    rpc.sendAsync('importer-choose', { dups, chosens })
  }

  handleCancel (){
    rpc.sendAsync('importer-cancel')
  }

  handleFinish (){
    this.setState({ state: 'finished' })
  }

  handleChoose (img){
    let { chosens } = this.state

    let idx = _.findIndex(chosens, ({ uid }) => uid === img.uid) 
    if (idx === -1){
      this.setState(({ chosens }) => ({ chosens: _.concat(chosens, img) }))
    }
    else {
      this.setState(({ chosens }) => ({ chosens: _.without(chosens, img) }))
    }
  }

  render (){
    let { dups } = this.props
    let { chosens, state } = this.state

    if (state === 'finished'){
      return (
        <Redirect to="/feature" />
      )
    }

    return (
      <div className={classes.duplicate}>
        <div>
          <button onClick={() => this.handleConfirm()} >Confirm</button>
          <button onClick={() => this.handleCancel()} >Cancel</button>
        </div>
        {
          _.toPairs(dups).map(([fp, group]) => (
            <DupGroup 
              key={fp} 
              imgs={group} 
              fingerprint={fp}
              chosens={chosens} 
              onChoose={img => this.handleChoose(img)}
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