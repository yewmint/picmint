import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import Page from './Page'
import _ from 'lodash'
import DetailInfo from './DetailInfo'
import DetailImage from './DetailImage'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  detail: {
    display: 'grid',
    'grid-template-columns': '240px auto',
    'grid-template-rows': '100%',
    'align-items': 'stretch',
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

import defaultSrc from '../../asset/src.jpg'
import defaultThumb from '../../asset/icon-trans@0.5x.png'
const img = {
  id: 10,
  src: defaultSrc,
  thumb: defaultThumb,
  tags: '1 2 3 4 5 6 7'
}

class Detail extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let id = _.isUndefined(this.props.id) ? -1 : this.props.id

    return (
      <div className={classes.detail}>
        <DetailInfo img={img} />
        <DetailImage src={img.src} />
      </div>
    )
  }
}

Detail.defaultProps = {
}

Detail.propTypes = {
}

/**
 * wrap Detail to accept params as props from Page
 */
export default () => (
  <Page path="/detail/:id">
    <Detail />
  </Page>
)