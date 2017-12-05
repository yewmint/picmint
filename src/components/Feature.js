import React from 'react'
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

// DEBUG: 
const imgs = _.range(32).map((val) => ({ id: val }))

export default class Feature extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
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
}

Feature.propTypes = {
}