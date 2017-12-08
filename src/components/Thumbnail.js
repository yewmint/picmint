import React from 'react'
import jss from 'jss'
import PropTypes from 'prop-types'
import Image from './Image'
import { Link } from 'react-router-dom'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  thumbnail: {
    display: 'grid',
    width: 128,
    height: 128,
    'background-color': '#f1f1f1',
    cursor: 'pointer',
    overflow: 'hidden',
    'border-radius': '8px',
    'box-shadow': '0 1px 5px 1px #888',
    transition: 'box-shadow 200ms ease-in-out, '
      + 'transform 200ms ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      'box-shadow': '0 25px 50px #aaa',
      transition: 'box-shadow 200ms ease-in-out, '
        + 'transform 200ms ease-in-out',
    },
    '& img': {
      width: 128,
      height: 128,
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class Thumbnail extends React.Component{
  constructor (props){
    super(props)
  }

  render (){
    let id = this.props.id
    let archive = this.props.archive
    let src = `/store/thumbs/${archive}/${id}.jpg`

    return (
      <Link to={'/detail/' + id}>
        <div className={classes.thumbnail}>
          <img src={src} />
        </div>
      </Link>
    )
  }
}

Thumbnail.defaultProps = {
}

Thumbnail.propTypes = {
  id: PropTypes.number.isRequired,
  archive: PropTypes.number.isRequired
}
