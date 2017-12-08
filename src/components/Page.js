import React from 'react'
import classname from 'classname'
import { Transition } from 'react-transition-group'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const DURATION = 150

const styles = {
  page: {
    position: 'absolute',
    x: 0,
    y: 0,
    'overflow-wrap': 'break-word',
    'z-index': 0
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class Page extends React.Component {
  constructor (props){
    super(props)
  }

  renderChildren (params){
    let cls = classname(classes.page)

    let children = React.Children.map(
      this.props.children, 
      child => React.cloneElement(child, params)
    )
    
    return (
      <div className={classname(cls, 'anim-page-fadein')}>
        {children}
      </div>
    )
  }

  render (){
    let path = this.props.path

    return (
      <Route exact path={path} render={
        ({ match: { params } }) => this.renderChildren(params)
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
