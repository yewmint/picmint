import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

export default class InputText extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let field = this.props.field
    let text = this.props.text
    let type = this.props.type
    let disabled = this.props.disabled

    let id = `input-${field}`
    let placeholder = `Enter ${text}`

    return (
      <div className="form-group">
        <label htmlFor={id}>{text}</label>
        <input type={type} className="form-control" id={id} placeholder={placeholder} disabled={disabled} />
      </div>
    )
  }
}

InputText.defaultProps = {
  type: 'text',
  disabled: false
}

InputText.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}