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
    margin: {
      top: 8,
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
  }

  render (){
    let tag = this.props.tag

    return (
      <div className={classes.bar} >
        <p>{tag}</p>
        <button onClick={() => this.props.onRemove(tag)}><MdClear /></button>
      </div>
    )
  }
}

TagBar.defaultProps = {
  tag: 'default',
  onRemove: _.noop,
}

TagBar.propTypes = {
  tag: PropTypes.string,
  onRemove: PropTypes.func,
}