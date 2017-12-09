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
  section: {
    transition: 'all 100ms'
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class TagSection extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let tags = this.props.tags
    let onRemoveTag = this.props.onRemoveTag

    return (
      <div className={classes.section}>
        {tags.map((tag) => (
          <TagBar 
            key={tag} 
            tag={tag}
            onRemove={onRemoveTag} 
          />
        ))}
      </div>
    )
  }
}

TagSection.defaultProps = {
  tags: [],
  onRemoveTag: _.noop
}

TagSection.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  onTagRonRemoveTagemove: PropTypes.func
}