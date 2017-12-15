import React from 'react'
import jss from 'jss'
import PropTypes from 'prop-types'
import DupThumbnail from './DupThumbnail'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  frame: {
    display: 'grid',
    'grid-template-columns': '180px',
    'grid-template-rows': '180px 40px',
    'justify-items': 'center',
    'align-items': 'center',
    width: 180,
    height: 220,
  },

  info: {
    width: 128,
    height: 40,
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class DupFrame extends React.Component{
  static propTypes = {
    src: PropTypes.string.isRequired,
  }
  
  constructor (props){
    super(props)
  }

  render (){
    let { img } = this.props
    let { archive, id, tmpId, width, height } = img
    let src = ''

    if (archive){
      src = `/store/pics/${archive}/${id}.jpg`
    }
    else {
      src = `/store/tmp/pics/${tmpId}.jpg`
    }

    return (
      <div className={classes.frame}>
        <DupThumbnail src={src} />
        <p className={classes.icon} >
          {`${width} x ${height}`}
        </p>
      </div>
    )
  }
}
