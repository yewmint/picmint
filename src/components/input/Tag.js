import React from 'react'
import PropTypes from 'prop-types'
import classname from 'classname'
import { actions } from '../../actions'
import LineFrame from './LineFrame'
import { connect } from 'react-redux'
import { TagSection, TagNew } from '../tag'
import _ from 'lodash'

class Tag extends React.Component {
  constructor (props){
    super(props)

    this.state = {
      value: props.value
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  render (){
    let tags = this.props.tags
    let { removeTag, newTag } = this.props

    return (
      <LineFrame>
        <p>Tags</p>
        <TagNew onNewTag={newTag} />
        <TagSection onRemoveTag={removeTag} tags={tags} />
      </LineFrame>
    )
  }
}

Tag.defaultProps = {
  tags: [],
  newTag: _.noop,
  removeTag: _.noop
}

Tag.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  newTag: PropTypes.func,
  removeTag: PropTypes.func,
}

export default connect(
  state => ({
    tags: _.compact(state.detail.img.tags.split(/\s+/)) 
  }),
  dispatch => ({ 
    newTag: tag => dispatch(actions.detail.newTag(tag)),
    removeTag: tag => dispatch(actions.detail.removeTag(tag)),
  })
)(Tag)