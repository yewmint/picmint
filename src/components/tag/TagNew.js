import React from 'react'
import PropTypes from 'prop-types'
import color from 'color'
import classname from 'classname'
import { MdClear, MdAdd } from 'react-icons/lib/md'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  new: {
    display: 'grid',
    'grid-template-columns': 'auto 32px',
    'grid-template-rows': 'auto',
    padding: 0,
    overflow: 'hidden',
    'background-color': 'white',
    'border-radius': '4px',
    height: 32,
    margin: {
      top: 8,
      bottom: 8
    },
    '&>input': {
      width: 168,
      border: 'none',
      padding: '0 8px',
      '&:focus': {
        outline: 'none'
      }
    },
    '&>button': {
      background: 'none',
      border: 'none',
      width: 32,
      height: 32,
      padding: 8,
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

export default class TagNew extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    return (
      <div className={classes.new}>
        <input />
        <button ><MdAdd /></button>
      </div>
    )
  }
}