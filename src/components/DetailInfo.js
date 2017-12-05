import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Page from './Page'
import ThumbnailList from './ThumbnailList'
import InputText from './InputText'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  feature: {
    margin: {
      top: 20,
      bottom: 20
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class DetailInfo extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let img = this.props.img
    
    return (
      <div>
        <InputText text="Id" field="id" />
      </div>
    )
  }
}

DetailInfo.defaultProps = {
}

DetailInfo.propTypes = {
}