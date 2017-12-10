import React from 'react'
import PropTypes from 'prop-types'
import color from 'color'
import classname from 'classname'
import { MdClear } from 'react-icons/lib/md'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  bar: {
    display: 'grid',
    'grid-template-columns': 'auto 24px',
    'grid-template-rows': 'auto',
    padding: 4,
    'background-color': '#dadada',
    'border-radius': '4px',
    height: 32,
    animation: 'list-fadein 100ms',
    margin: {
      top: 0,
      bottom: 8
    },
    '&>p': {
      margin: '0 4px',
      'line-height': '24px'
    },
    '&>button': {
      background: 'none',
      border: 'none',
      width: 24,
      height: 24,
      padding: 4,
      display: 'grid',
      color: color('#212529').lighten(4).rgb().string(),
      cursor: 'pointer'
    },
    '&>button:focus': {
      border: 'none',
      outline: 'none'
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class TagBar extends React.Component {
  constructor (props){
    super(props)

    this.state = {
      hidden: false
    }
  }
  
  handleClick (){
    if (this.state.hidden || this.hidden) return
    this.setState({ hidden: true })
    this.hidden = true

    let { tag, onRemove } = this.props
    setTimeout(() => onRemove(tag), 100)
  }

  render (){
    let { tag } = this.props
    let { hidden } = this.state

    let style = {}
    if (hidden){
      style = { 
        opacity: 0,
        animation: 'list-fadeout 100ms',
      }
    }

    return (
      <div className={classes.bar} style={style} >
        <p>{tag}</p>
        <button onClick={() => this.handleClick()}><MdClear /></button>
      </div>
    )
  }
}

TagBar.defaultProps = {
  tag: 'default',
  show: true,
  onRemove: _.noop,
}

TagBar.propTypes = {
  tag: PropTypes.string,
  show: PropTypes.bool,
  onRemove: PropTypes.func,
}