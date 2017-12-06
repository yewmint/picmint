import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import { Readonly, Tag } from './input'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  info: {
    width: 240,
    height: 680,
    overflow: 'auto',
    padding: 16
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class DetailInfo extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    return (
      <div className={classname(classes.info)}>
        <Readonly field="ID" value="566" />
        <Readonly field="Archive" value="3" />
        <Readonly field="Size" value="1920 x 1080" />
        <Readonly field="Date" value="2017/12/06" />
        <Tag tags={['abc', 'def', 'ghi', 'jkl', 'sdfl', 'qwrl']} />
      </div>
    )
  }
}

DetailInfo.defaultProps = {
}

DetailInfo.propTypes = {
}