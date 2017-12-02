import React from 'react'
import TitleButton from './title-button'
import jss from 'jss'
import classname from 'classname'

import icon from '../../asset/icon-trans@0.125x.png'

const styles = {
  title: {
    height: '32px',
    margin: '4px',
    display: 'grid',
    'grid-template-columns': '32px 80px auto 100px',
    'grid-template-rows': '100%',
    '-webkit-app-region': 'drag'
  },
  image: {
    height: '32px',
    width: '32px'
  },
  text: {
    'text-align': 'center',
    'line-height': '32px',
    'font-size': '1.2rem'
  }
}

const {classes} = jss.createStyleSheet(styles).attach()

export class Title extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    return (
      <div className={classes.title}>
        <img className={classes.image} src={icon}/>
        <div className={classes.text} >Picmint</div>
      </div>
    )
  }
}
