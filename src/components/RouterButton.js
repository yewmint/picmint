import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classname from 'classname'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  btn: {
    height: 32,
    margin: {
      left: 8,
      right: 8
    },
    'text-align': 'center',
    '-webkit-app-region': 'no-drag',
    'background-color': 'transparent',
    cursor: 'pointer',
    'transition': 'background-color 100ms, color 100ms',
    '&:hover': {
      'background-color': '#aaa',
      'transition': 'background-color 100ms'
    },
    '& *': {
      display: 'inline-block',
      'line-height': '32px',
      color: '#212529;',
      width: '100%'
    },
    '& *:hover': {
      color: '#212529;',
      'text-decoration': 'none'
    },
    '&.active': {
      'background-color': '#1fb37c',
      '& *': {
        color: '#fff'
      }
    },
    '&.disabled': {
      '& *': {
        cursor: 'default',
        color: '#888',
      },
      'background-color': 'transparent',
      '&:hover': {
        'background-color': 'transparent',
      },
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class RouterButton extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let { to, disabled } = this.props

    let styles = {
      active: to === location.pathname,
      disabled
    }

    return (
      <div 
        className={classname(classes.btn, styles)}
      >
        {disabled ? (
          <span>{this.props.children}</span>
        ) : (
          <Link to={to}>{this.props.children}</Link>
        )}
      </div>
    )
  }
}

RouterButton.defaultProps = {
  to: '/',
  disabled: false
}

RouterButton.propTypes = {
  to: PropTypes.string,
  disabled: PropTypes.bool
}
