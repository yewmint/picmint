import React from 'react'
import PropTypes from 'prop-types'
import classname from 'classname'
import LineFrame from './LineFrame'
import { TagSection, TagNew } from '../tag'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  textarea: {
    margin: {
      top: 4
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class Tag extends React.Component {
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

    return (
      <LineFrame>
        <p>Tags</p>
        <TagNew />
        <TagSection tags={tags} />
      </LineFrame>
    )
  }
}

Tag.defaultProps = {
  tags: []
}

Tag.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
}