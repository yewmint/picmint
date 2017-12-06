import React from 'react'
import PropTypes from 'prop-types'
import classname from 'classname'
import LineFrame from './LineFrame'
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

export default class Readonly extends React.Component {
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
    let field = this.props.field
    let value = this.state.value

    let id = `area-${field}`
    let text = _.capitalize(field)

    return (
      <LineFrame>
        <p>{text}</p>
        <textarea 
          className={classname('form-control', classes.textarea)}
          id="id" 
          rows="6"
          value={value}
          onChange={(ev) => this.handleChange(ev)}
        />
      </LineFrame>
    )
  }
}

Readonly.defaultProps = {
}

Readonly.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}