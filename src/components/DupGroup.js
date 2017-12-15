import React from 'react'
import jss from 'jss'
import PropTypes from 'prop-types'
import DupFrame from './DupFrame'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  group: {
    margin: {
      top: 30,
      left: 20,
      right: 20
    },
    'background-color': '#fff',
    'box-shadow': '0 0 10px #bdbdbd'
  },

  title: {
    // '&::after': {
    //   content: '" "',
    //   display: 'inline-block',
    //   width: 1100,
    //   margin: {
    //     bottom: 4,
    //     left: 10
    //   },
    //   'border-bottom': '1px solid #afafaf',
    // },
    margin: {
      bottom: 20
    }
  },
  
  container: {
    display: 'grid',
    'grid-template-columns': 'repeat(7, 180px)',
    'grid-template-rows': '220px',
    'justify-items': 'center',
    'align-items': 'center',
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class DupGroup extends React.Component{
  static defaultProps = {
    fingerprint: 'none',
    imgs: []
  }
  
  static propTypes = {
    fingerprint: PropTypes.string,
    imgs: PropTypes.array,
  }
  
  constructor (props){
    super(props)
  }

  renderImgs (){
    let { imgs } = this.props

    return imgs.map((img, idx) => (
      <DupFrame key={idx} img={img} />
    ))
  }

  render (){
    return (
      <div className={classes.group} >
        <div className={classes.container} >
          {this.renderImgs()}
        </div>
      </div>
    )
  }
}
