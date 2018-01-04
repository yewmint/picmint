import React from 'react'
import anime from 'animejs'
import PropTypes from 'prop-types'

export default class TopFade extends React.Component {
  static defaultProps = {
    duration: 200
  }

  static propTypes = {
    duration: PropTypes.number
  }

  animate (){
    if (this.div){
      anime({
        targets: this.div,
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: this.props.duration,
        easing: 'easeOutQuad',
      })
    }
  }

  componentDidMount (){
    this.animate()
  }

  componentWillReceiveProps (nextProps){
    if (this.props !== nextProps){
      this.animate()
    }
  }

  render (){
    return (
      <div ref={ref => this.div = ref}>
        {this.props.children}
      </div>
    )
  }
}