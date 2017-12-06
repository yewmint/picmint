import React from 'react'
import classname from 'classname'
import color from 'color'
import { MdSearch } from 'react-icons/lib/md'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  bar: {
    display: 'grid',
    'grid-template-columns': 'auto 32px',
    'grid-template-rows': 'auto',
    'border-radius': 4,
    width: 600,
    'text-align': 'center',
    overflow: 'hidden',
    margin: '40px auto',
    '&>input': {
      border: 'none',
      'font-size': '16px',
      'line-height': '16px',
      padding: 8,
      height: 32,
      '&:focus': {
        outline: 'none'
      }
    },
    '&>button': {
      background: '#00877d',
      border: 'none',
      width: 32,
      height: 32,
      padding: 8,
      display: 'grid',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 100ms',
      '&:focus': {
        outline: 'none'
      },
      '&:hover': {
        transition: 'background-color 100ms',
        background: color('#00877d').lighten(0.3).rgb().string(),
      }
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class SearchBar extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    return (
      <div className={classes.bar}>
        <input id="search-bar" placeholder="Enter tags" />
        <button><MdSearch /></button>
      </div>
    )
  }
}