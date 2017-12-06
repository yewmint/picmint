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
    'transition': 'background-color 100ms',
    '&:hover': {
      'background-color': '#aaa',
      'transition': 'background-color 100ms'
    },
    '& a': {
      display: 'inline-block',
      'line-height': '32px',
      color: '#212529;',
      width: '100%'
    },
    '& a:hover': {
      'text-decoration': 'none'
    },
    '&.active': {
      'background-color': '#aaa'
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class RouterButton extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let to = this.props.to

    let style = ''
    if (to === location.pathname){
      style = 'active'
    }

    return (
      <div className={classname(classes.btn, style)}>
        <Link to={to}>{this.props.children}</Link>
      </div>
    )
  }
}

RouterButton.defaultProps = {
  to: '/',
}

RouterButton.propTypes = {
  to: PropTypes.string
}
