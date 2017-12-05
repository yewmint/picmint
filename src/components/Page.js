import React from 'react'
import classname from 'classname'
import { Transition } from 'react-transition-group'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
import { isMaster } from 'cluster';
jss.setup(preset())

const DURATION = 200

const styles = {
  page: {
    position: 'absolute',
    x: 0,
    y: 0,
    'overflow-wrap': 'break-word',
    opacity: 0,
    transform: 'translateY(-20px)',
    transition: `opacity ${DURATION}ms, `
      + `transform ${DURATION}ms ease-in`,
    '&.show': {
      opacity: 1,
      transform: 'translateY(0)',
      transition: `opacity ${DURATION}ms, `
        + `transform ${DURATION}ms ease-out`,
    },
    '&.disabled': {
      opacity: 0,
      display: 'none',
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class Page extends React.Component {
  constructor (props){
    super(props)

    this.state = { disabled: true }
  }

  handleExited (){
    this.setState(prev => ({ ...prev, disabled: true }))
  }

  handleEnter (){
    this.setState(prev => ({ ...prev, disabled: false }))
  }

  renderChildren (match){
    let isMatch = !!match
    let cls = classname(classes.page, { show: isMatch })
    let disabled = this.state.disabled
    let children = this.props.children

    if (isMatch){
      children = React.Children.map(
        children, 
        child => React.cloneElement(child, match.params)
      )
    }
    
    return (
      <Transition 
        in={isMatch} 
        timeout={DURATION} 
        onExited={() => this.handleExited()} 
        onEnter={() => this.handleEnter()}
      >
        <div className={cls}>
          {!disabled && children}
        </div>
      </Transition>
    )
  }

  render (){
    let path = this.props.path

    return (
      <Route exact path={path} children={
        ({ match }) => this.renderChildren(match)
      }/>
    )
  }
}

Page.defaultProps = {
  src: '/'
}

Page.propTypes = {
  src: PropTypes.string
}
