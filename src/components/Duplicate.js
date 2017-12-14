import React from 'react'
import { connect } from 'react-redux'
import { actions } from '../actions'
import classname from 'classname'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Page from './Page'
import ThumbnailList from './ThumbnailList'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  duplicate: {
    margin: {
      top: 20,
      bottom: 20
    }
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
    console.log(dups)

    return (
      <div className={classes.feature}>
        {dups}
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