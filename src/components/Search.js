import React from 'react'
import classname from 'classname'
import { connect } from 'react-redux'
import { actions } from '../actions'
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
    margin: '20px auto',
    width: 1280
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

class Search extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    let { imgs, update, words } = this.props

    return (
      <Page path="/search">
        <div className={classes.search}>
          <SearchBar onUpdate={update} words={words} />
          <ThumbnailList line={3} imgs={imgs} />
        </div>
      </Page>
    )
  }
}

Search.propTypes = {
  update: PropTypes.func.isRequired,
  imgs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired
}

const ConnectedSearch = connect(
  state => state.search,
  dispatch => ({
    update: imgs => dispatch(actions.search.update(imgs))
  })
)(Search)

export default () => (
  <Page path="/search">
    <ConnectedSearch />
  </Page>
)