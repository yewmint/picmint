import React from 'react'
import jss from 'jss'

import TitleButton from './TitleButton'
import icon from '../../asset/icon-trans@0.125x.png'


const styles = {
  title: {
    height: '32px',
    margin: '4px',
    display: 'grid',
    'grid-template-columns': '32px 80px auto 96px',
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
  },
  btnBar: {
    'grid-column': '4 / 5'
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class Title extends React.Component {
  render (){
    return (
      <div className={classes.title}>
        <img className={classes.image} src={icon}/>
        <div className={classes.text} >Picmint</div>
        <div className={classes.btnBar}>
          <TitleButton color="#555" iconName="minimize" />
          <TitleButton color="#555" iconName="maxmize" />
          <TitleButton color="#555" iconName="close" />
        </div>
      </div>
    )
  }
}
