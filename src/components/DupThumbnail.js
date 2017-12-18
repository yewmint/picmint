import React from 'react'
import jss from 'jss'
import PropTypes from 'prop-types'
import classname from 'classname'
import Image from './Image'
import { MdDone } from 'react-icons/lib/md'
import { Link } from 'react-router-dom'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  thumbnail: {
    display: 'grid',
    width: 128,
    height: 128,
    cursor: 'pointer',
    overflow: 'hidden',
    'border-radius': '8px',
    'box-shadow': '0 1px 5px 1px #888',
    'background-size': 'cover',
    'background-position': 'center',
    transition: 'box-shadow 200ms ease-in-out, '
      + 'transform 200ms ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      'box-shadow': '0 25px 50px #aaa',
      transition: 'box-shadow 200ms ease-in-out, '
        + 'transform 200ms ease-in-out',
    },
  },

  icon: {
    width: 128,
    height: 128,
    padding: 32,
    color: '#48dc7e',
    background: 'rgba(0, 0, 0, 0.5)',
    opacity: 0,
    transition: 'opacity 200ms',

    '&.active': {
      opacity: 1,
      transition: 'opacity 200ms',
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class DupThumbnail extends React.Component{
  static propTypes = {
    src: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onChoose: PropTypes.func.isRequired
  }
  
  constructor (props){
    super(props)
  }

  render (){
    let { src, active, onChoose } = this.props

    let style = {
      backgroundImage: `url(${src})`
    }

    let iconCls = classname(classes.icon, { active })

    return (
      <div 
        className={classes.thumbnail} 
        style={style} 
        onClick={onChoose}
      >
        <div className={iconCls} >
          <MdDone size={64} />
        </div>
      </div>
    )
  }
}
