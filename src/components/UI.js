import React from 'react'
import Title from './Title'
import Feature from './Feature'
import Search from './Search'
import Import from './Import'
import Detail from './Detail'
import PageContainer from './PageContainer'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'

import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  app: {
    display: 'grid',
    'grid-template-columns': '100%',
    'grid-template-rows': `40px ${720-40}px`,
    'align-items': 'stretch',
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

export default class UI extends React.Component {
  constructor (props){
    super(props)
  }

  render (){
    return (
      <Router>
        <div id="app" className={classes.app}>
          <Title/>
          <PageContainer>
            <Feature />
            <Search />
            <Import />
            <Detail />
            <Route exact path="/" render={() => (
              <Redirect from="/" to="/feature" />
            )} />
          </PageContainer>
        </div>
      </Router>
    )
  }
}
