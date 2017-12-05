import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import Page from './Page'
import Thumbnail from './Thumbnail'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  list: {
    display: 'grid',
    'grid-template-columns': 'repeat(8, 160px)',
    'grid-template-rows': data => `repeat(${data.line}, 160px)`,
    'justify-items': 'center',
    'align-items': 'center'
  }
}

const sheet = jss.createStyleSheet(styles)

export default class ThumbnailList extends React.Component {
  constructor (props){
    super(props)

    this.classes = sheet.update({ line: props.line }).attach().classes
  }

  render (){
    let imgs = this.props.imgs
    let classes = this.classes

    return (
      <div className={classes.list}>
        {imgs.map((val) => (
          <Thumbnail key={val.id} id={val.id} src={val.src} />
        ))}
      </div>
    )
  }
}

ThumbnailList.defaultProps = {
  line: 1,
  imgs: []
}

ThumbnailList.propTypes = {
  line: PropTypes.number,
  imgs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    src: PropTypes.string
  }))
}