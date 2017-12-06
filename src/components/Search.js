import React from 'react'
import classname from 'classname'
import { Transition } from 'react-transition-group'
import PropTypes from 'prop-types'
import ThumbnailList from './ThumbnailList'
import SearchBar from './SearchBar'
import Page from './Page'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  search: {
    margin: {
      top: 20,
      bottom: 20
    }
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

// DEBUG: 
const imgs = _.range(32).map((val) => ({ id: val }))

export default class Search extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    return (
      <Page path="/search">
        <div className={classes.search}>
          <SearchBar />
          <ThumbnailList line={3} imgs={imgs} />
        </div>
      </Page>
    )
  }
}