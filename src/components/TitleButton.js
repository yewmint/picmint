import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

import { MdClear, MdRemove, MdCropDin } from 'react-icons/lib/md'

function color(color){
  let _styles = { colorStyle: { color } }
  const { classes } = jss.createStyleSheet(_styles).attach()
  return classes.colorStyle
}

const styles = {
  btn: {
    display: 'inline-grid',
    width: '32px',
    height: '32px',
    'border-radius': '0',
    '-webkit-app-region': 'no-drag',
    'background-color': 'transparent',
    'border': 'none',
    'padding': '8px',
    'transition': 'background-color 100ms',
    '&:hover': {
      'background-color': '#aaa',
      'transition': 'background-color 100ms'
    },
    '&:focus': {
      'outline': 'none',
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class TitleButton extends React.Component {
  renderIcon (){
    if (this.props.iconName === 'close'){
      return <MdClear />
    }
    else if (this.props.iconName === 'minimize'){
      return <MdRemove />
    }
    else if (this.props.iconName === 'maxmize'){
      return <MdCropDin />
    }

    return null
  }

  render (){
    return (
      <button className={classname(color(this.props.color), classes.btn)} onClick={() => this.props.callback()}>
        {this.renderIcon()}
      </button>
    )
  }
}

TitleButton.defaultProps = {
  color: '#555',
  iconName: 'close',
  callback: () => {}
}

TitleButton.propTypes = {
  color: PropTypes.string,
  iconName: PropTypes.string,
  callback: PropTypes.func
}
