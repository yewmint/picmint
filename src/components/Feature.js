import React from 'react'
import { connect } from 'react-redux'
import classname from 'classname'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Page from './Page'
import ThumbnailList from './ThumbnailList'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  feature: {
    margin: {
      top: 20,
      bottom: 20
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

class Feature extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let imgs = this.props.imgs

    return (
      <Page path="/feature">
        <div className={classes.feature}>
          <ThumbnailList line={4} imgs={imgs} />
        </div>
      </Page>
    )
  }
}

Feature.defaultProps = {
  imgs: []
}

Feature.propTypes = {
  imgs: PropTypes.arrayOf(PropTypes.object)
}

export default connect(state => state.feature)(Feature)