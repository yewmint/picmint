import React from 'react'
import classname from 'classname'
import color from 'color'
import { MdSearch } from 'react-icons/lib/md'
import { rpc } from '../utils'
import PropTypes from 'prop-types'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  bar: {
    display: 'grid',
    'grid-template-columns': 'auto 32px',
    'grid-template-rows': 'auto',
    'border-radius': 4,
    width: 600,
    'text-align': 'center',
    overflow: 'hidden',
    margin: '40px auto',
    '&>input': {
      border: 'none',
      'font-size': '16px',
      'line-height': '16px',
      padding: 8,
      height: 32,
      '&:focus': {
        outline: 'none'
      }
    },
    '&>button': {
      background: '#1fb37c',
      border: 'none',
      width: 32,
      height: 32,
      padding: 8,
      display: 'grid',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 100ms',
      '&:focus': {
        outline: 'none'
      },
      '&:hover': {
        transition: 'background-color 100ms',
        background: color('#1fb37c').lighten(0.3).rgb().string(),
      },
      '&:active': {
        transition: 'background-color 100ms',
        background: color('#1fb37c').darken(0.3).rgb().string(),
      }
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class SearchBar extends React.Component {
  constructor (props){
    super(props)
    this.state = { value: props.words }
  }

  componentWillReceiveProps (nextProps){
    this.setState({ value: nextProps.words })
  }
  
  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit (ev){
    ev.preventDefault()

    if (this.state.value.length === 0){
      return
    }

    let { success, imgs, error } = rpc.call('db-search', this.state.value)
    
    if (success){
      this.props.onUpdate({
        imgs,
        words: this.state.value
      })
    }
    else {
      console.error(error)
    }
  }

  render (){
    return (
      <form 
        onSubmit={(ev) => this.handleSubmit(ev)} 
        className={classes.bar}
      >
        <input 
          id="search-bar" 
          placeholder="Time to search now :)" 
          onChange={ev => this.handleChange(ev)}
          value={this.state.value}
        />
        <button type="submit"><MdSearch /></button>
      </form>
    )
  }
}

SearchBar.defaultProps = {
  onUpdate: _.noop,
  words: ''
}

SearchBar.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  words: PropTypes.string
}