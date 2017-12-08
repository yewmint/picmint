import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import { rpc } from '../utils'
import Page from './Page'
import _ from 'lodash'
import DetailInfo from './DetailInfo'
import DetailImage from './DetailImage'
import { connect } from 'react-redux'
import { actions } from '../actions'
import jss from 'jss'
import preset from 'jss-preset-default'
import { tmpdir } from 'os';
jss.setup(preset())

const styles = {
  detail: {
    display: 'grid',
    'grid-template-columns': '240px auto',
    'grid-template-rows': '100%',
    'align-items': 'stretch',
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

class Detail extends React.Component {
  constructor (props){
    super(props)

    this.img = props.img
    console.log(props.img)
  }

  componentDidMount() {
    if (!this._isLoaded()){
      this._loadImg()
      this.props.removeTag('rainbow')
    }
  }

  _loadImg (){
    let id = Number.parseInt(this.props.id)
    let result = rpc.call('db-get-img', id)
    if (result.success) {
      this.props.setup(result.img)
      this.img = result.img
    }
  }

  _isLoaded (){
    return Number.parseInt(this.props.id) === this.props.img.id
  }

  render (){
    let img = this.img
    let src = `/store/imgs/${img.archive}/${img.id}.jpg`

    return (
      <div className={classes.detail}>
        <DetailInfo img={img} />
        <DetailImage src={src} width={img.width} height={img.height} />
      </div>
    )
  }
}

Detail.propTypes = {
  id: PropTypes.string.isRequired,
  img: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired
}

const ConnectedDetail = connect(
  state => {
    console.log('select')
    console.log(state.detail.img)
    console.log(window.store.getState())
    return { img: state.detail.img }
  },
  
  dispatch => ({ 
    setup: img => dispatch(actions.detail.setup(img)),
    removeTag: tag => dispatch(actions.detail.removeTag(tag)),
  })
)(Detail)

/**
 * wrap Detail to accept params as props from Page
 */
export default () => (
  <Page path="/detail/:id">
    <ConnectedDetail />
  </Page>
)