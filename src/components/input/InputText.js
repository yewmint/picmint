import React from 'react'
import PropTypes from 'prop-types'
import classname from 'classname'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  input: {
    display: 'grid',
    'grid-template-columns': '20% auto',
    'grid-template-rows': '100%',
    'justify-items': 'left',
    'align-items': 'center'
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class InputText extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let field = this.props.field
    let text = this.props.text
    let type = this.props.type
    let readonly = this.props.readonly

    let id = `input-${field}`
    let placeholder = `Enter ${text}`

    return (
      <div className={classname('form-group', classes.input)}>
        <label htmlFor={id} className="col-form-label">{text}</label>
        <div>
          <input 
            type={type} 
            className={
              classname(
                'form-control', 
                { 'form-control-plaintext': readonly }
              )
            } 
            id={id} 
            placeholder={placeholder} 
            readOnly={readonly} 
          />
        </div>
      </div>
    )
  }
}

InputText.defaultProps = {
  type: 'text',
  readonly: true,
  area: false
}

InputText.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  readonly: PropTypes.bool,
  area: PropTypes.bool
}