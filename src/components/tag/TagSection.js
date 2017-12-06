import React from 'react'
import PropTypes from 'prop-types'
import classname from 'classname'
import { MdClear } from 'react-icons/lib/md'
import TagBar from './TagBar'
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

export default class TagSection extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let tags = this.props.tags
    let onTagRemove = this.props.onTagRemove

    return (
      <div>
        {tags.map((tag) => (
          <TagBar key={tag} tag={tag} onRemove={() => onTagRemove(tag)} />
        ))}
      </div>
    )
  }
}

TagSection.defaultProps = {
  tags: [],
  onTagRemove: _.noop
}

TagSection.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  onTagRemove: PropTypes.func
}