import React from 'react'
import jss from 'jss'
import TitleButton from './TitleButton'
import icon from '../../asset/icon-trans@0.125x.png'
import { remote } from 'electron'
import RouterButton from './RouterButton'

const styles = {
  title: {
    height: '32px',
    margin: '4px',
    display: 'grid',
    'grid-template-columns': '32px 60px auto 96px',
    'grid-template-rows': '100%',
    '-webkit-app-region': 'drag'
  },
  image: {
    height: '24px',
    width: '24px',
    margin: '4px'
  },
  links: {
    display: 'grid',
    'grid-template-columns': 'auto 100px 100px 100px auto',
    '& div:first-child': {
      'grid-column-start': 2
    }
  },
  text: {
    'text-align': 'center',
    'line-height': '32px',
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class Title extends React.Component {
  constructor (props){
    super(props)

    this.minimize = () => remote.getCurrentWindow().minimize()
    this.maxmize = () => {
      // if (remote.getCurrentWindow().isMaximized()){
      //   remote.getCurrentWindow().unmaximize()
      // }
      // else {
      //   remote.getCurrentWindow().maximize()
      // }
    }
    this.close = () => remote.getCurrentWindow().close()
  }

  render (){
    return (
      <div className={classes.title}>
        <img className={classes.image} src={icon}/>
        <div className={classes.text} >Picmint</div>
        <div className={classes.links}>
          <RouterButton to="/feature">Feature</RouterButton>
          <RouterButton to="/search">Search</RouterButton>
          <RouterButton to="/import">Import</RouterButton>
        </div>
        <div>
          <TitleButton 
            color="#555" 
            iconName="minimize" 
            callback={this.minimize} 
          />
          <TitleButton 
            color="#555" 
            iconName="maxmize" 
            callback={this.maxmize} 
          />
          <TitleButton 
            color="#555" 
            iconName="close" 
            callback={this.close} 
          />
        </div>
      </div>
    )
  }
}
