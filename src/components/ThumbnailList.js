import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import color from 'color'
import Page from './Page'
import Thumbnail from './Thumbnail'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/lib/md'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  list: {
    display: 'grid',
    'grid-template-columns': 'repeat(8, 160px)',
    'justify-items': 'center',
    'align-items': 'center'
  },
  nav: {
    display: 'grid',
    'grid-template-columns': '32px auto 32px',
    'grid-template-rows': 'auto',
    'justify-items': 'center',
    'align-items': 'center',
    margin: '20px auto',
    width: 140,
    'text-align': 'center',
    '&>button': {
      background: '#aaaaaa',
      border: 'none',
      width: 32,
      height: 32,
      padding: 8,
      display: 'grid',
      color: '#212529',
      cursor: 'pointer',
      transition: 'background-color 100ms',
      '&:focus': {
        outline: 'none'
      },
      '&:hover': {
        transition: 'background-color 100ms',
        background: color('#aaaaaa').lighten(0.2).rgb().string(),
      }
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class ThumbnailList extends React.Component {
  constructor (props){
    super(props)

    this.state = { 
      curPage: 0
    }

    this.numPerPage = props.line * 8
    this.isPaged = this.numPerPage > props.imgs.length
  }

  render (){
    let curPage = this.state.curPage
    let numPerPage = this.numPerPage
    let imgs = this.props.imgs
    let line = this.props.line

    let renderImgs = _.chunk(imgs, numPerPage)[curPage]

    let style = {
      gridTemplateRows: `repeat(${line}, 160px)`
    }

    return (
      <div>
        <div className={classes.list} style={style}>
          {renderImgs.map((val) => (
            <Thumbnail key={val.id} id={val.id} src={val.src} />
          ))}
        </div>
        <div className={classes.nav} >
          <button><MdKeyboardArrowLeft /></button>
          <span>1/9</span>
          <button><MdKeyboardArrowRight /></button>
        </div>
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