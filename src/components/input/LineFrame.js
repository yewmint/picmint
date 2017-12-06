import React from 'react'
import PropTypes from 'prop-types'
import color from 'color'
import classname from 'classname'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  frame: {
    'margin': '4px',
    '&>*:first-child': {
      margin: 0,
      color: color('#212529').lighten(3).rgb().string()
    },
    '& p': {
      overflow: {
        wrap: 'normal',
        x: 'hidden'
      }
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class LineFrame extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    return (
      <div className={classname(classes.frame)}>
        {this.props.children}
      </div>
    )
  }
}

LineFrame.defaultProps = {
}

LineFrame.propTypes = {
}