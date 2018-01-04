import React from 'react'
import jss from 'jss'
import PropTypes from 'prop-types'
import DupThumbnail from './DupThumbnail'
import preset from 'jss-preset-default'
import _ from 'lodash'
import { connect } from 'react-redux'
import { actions } from '../actions'
jss.setup(preset())

const styles = {
  frame: {
    display: 'grid',
    'grid-template-columns': '180px',
    'grid-template-rows': '180px 40px',
    'justify-items': 'center',
    'align-items': 'center',
    width: 180,
    height: 220,
  },

  info: {
    width: 128,
    height: 40,
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

class DupFrame extends React.Component{
  static defaultProps = {
    chosens: [],
    onChoose: _.noop
  }

  static propTypes = {
    img: PropTypes.object.isRequired,
    chosens: PropTypes.array,
    onChoose: PropTypes.func
  }
  
  constructor (props){
    super(props)
  }

  _isChosen (){
    let { img, chosens } = this.props
    return _.findIndex(chosens, ({ uid }) => uid === img.uid) !== -1
  }

  handleChoose (){
    let { img, choose, unchoose } = this.props
    if (this._isChosen()){
      unchoose(img)
    }
    else {
      choose(img)
    }
  }

  render (){
    let { archive, id, tmpId, width, height } = this.props.img
    let src = ''

    if (archive){
      src = `/store/pics/${archive}/${id}.jpg`
    }
    else {
      src = `/store/tmp/pics/${tmpId}.jpg`
    }

    let active = this._isChosen()

    return (
      <div className={classes.frame}>
        <DupThumbnail 
          src={src} 
          active={active} 
          onChoose={() => this.handleChoose()} 
        />
        <p className={classes.icon} >
          {`${width} x ${height}`}
        </p>
      </div>
    )
  }
}

export default connect(
  state => state.duplicate,
  dispatch => ({
    choose: img => dispatch(actions.duplicate.choose(img)),
    unchoose: img => dispatch(actions.duplicate.unchoose(img))
  })
)(DupFrame)
