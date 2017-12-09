import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import { Readonly, Tag } from './input'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  info: {
    width: 240,
    height: 680,
    overflow: 'auto',
    padding: 16
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class DetailInfo extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let img = this.props.img

    return (
      <div className={classname(classes.info)}>
        <Readonly field="ID" value={img.id} />
        <Readonly field="Archive" value={img.archive} />
        <Readonly field="Size" value={`${img.width} x ${img.height}`} />
        <Readonly field="Date" value={img.date} />
        <Tag />
      </div>
    )
  }
}

DetailInfo.defaultProps = {

}

DetailInfo.propTypes = {
  img: PropTypes.shape({
    id: PropTypes.number,
    archive: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    date: PropTypes.string,
    tags: PropTypes.string
  })
}