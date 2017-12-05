import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import Page from './Page'
import _ from 'lodash'
import DetailInfo from './DetailInfo'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

import defaultSrc from '../../asset/src.jpg'

const styles = {
  image: {
    
    '& img': {

    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class DetailImage extends React.Component {
  render (){
    return (
      <div className={classes.image}>
        <img src={this.props.src} />
      </div>
    )
  }
}

DetailImage.defaultProps = {
  src: defaultSrc
}

DetailImage.propTypes = {
  src: PropTypes.string
}