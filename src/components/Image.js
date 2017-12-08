import React from 'react'
import { MdBlock, MdBlurOn  } from 'react-icons/lib/md'
import ImageLoader from 'react-imageloader'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  wrapper: {
    display: 'grid',
    'justify-items': 'center',
    'align-items': 'center',
    'background-color': '#f1f1f1',
    color: '#adadad'
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class Image extends React.Component {
  constructor (props){
    super(props)
  }

  renderPreload (){
    return (
      <div className={classes.wrapper}>
        <MdBlurOn size={32} />
      </div>
    )
  }

  render (){
    return (
      <ImageLoader
        wrapper={React.DOM.div}
        // preload={() => this.renderPreload()}
        style={{display: 'grid'}}
        src={this.props.src}
      >
        <div className={classes.wrapper}>
          <MdBlock size={32} />
        </div>
      </ImageLoader>
    )
  }
}

Image.defaultProps = {
  src: ''
}