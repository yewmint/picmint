import React from 'react'
import PropTypes from 'prop-types'
import classname from 'classname'
import LineFrame from './LineFrame'
import _ from 'lodash'

export default class Readonly extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let field = this.props.field
    let value = this.props.value

    return (
      <LineFrame>
        <p>{field}</p>
        <p>{value}</p>
      </LineFrame>
    )
  }
}

Readonly.defaultProps = {
}

Readonly.propTypes = {
  field: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}