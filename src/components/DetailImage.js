import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import Page from './Page'
import _ from 'lodash'
import DetailInfo from './DetailInfo'
import Image from './Image'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

import defaultSrc from '../../asset/src.jpg'

const WIDTH = 1040
const HEIGHT = 680

const styles = {
  image: {
    width: WIDTH,
    height: HEIGHT,
    'background-color': '#ccc',
    overflow: 'hidden',
    '& img': {
      transition: 'all 100ms ease-in-out',
      position: 'relative',
      '-webkit-user-drag': 'none',
      cursor: 'pointer'
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class DetailImage extends React.Component {
  constructor (props){
    super(props)

    this._initSize(props)
    
    this.state = {
      scaleRatio: 1
    }
  }

  componentWillReceiveProps (nextProps){
    this._initSize(nextProps)
  }

  _initSize (props){
    let width = props.width
    let height = props.height
    let whRatio = width / height

    if (width > WIDTH){
      width = WIDTH
      height = width / whRatio
    }
    
    if (height > HEIGHT){
      height = HEIGHT
      width = height * whRatio
    }
    
    this.width = width
    this.height = height
  }

  handleWheel (ev){
    ev.preventDefault()
    ev.stopPropagation()
    let deltaY = ev.deltaY
    this.setState(({ scaleRatio }) => {
      let newRatio = scaleRatio - deltaY / 1000
      return { scaleRatio: _.clamp(newRatio, 0.2, 2) }
    })
  }

  handleClick (ev){
    ev.preventDefault()
    ev.stopPropagation()
    ipcRenderer.send('open-image', this.props.src)
  }

  render (){
    let width = this.state.scaleRatio * this.width
    let height = this.state.scaleRatio * this.height

    let style = {
      width: `${width}px`,
      height: `${height}px`,
      left: `${WIDTH / 2 - width / 2}px`,
      top: `${HEIGHT / 2 - height / 2}px`
    }

    return (
      <div 
        className={classname(classes.image)} 
        onWheel={(ev) => this.handleWheel(ev)}
      >
        <img 
          src={this.props.src} 
          style={style}
          onClick={(ev) => this.handleClick(ev)}
        />
      </div>
    )
  }
}

DetailImage.defaultProps = {
  src: defaultSrc,
  width: 1200,
  height: 1200
}

DetailImage.propTypes = {
  src: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
}