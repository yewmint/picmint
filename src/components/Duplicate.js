import React from 'react'
import { connect } from 'react-redux'
import { actions } from '../actions'
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

class Duplicate extends React.Component {
  static propTypes = {
    dups: PropTypes.object.isRequired
  }

  constructor (props){
    super(props)
  }

  render (){
    let dups = this.props.dups

    return (
      <div className={classes.duplicate}>
        {
          _.toPairs(dups).map(([fp, group]) => (
            <DupGroup key={fp} imgs={group} fingerprint={fp} />
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