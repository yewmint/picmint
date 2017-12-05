import React from 'react'

import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  swipe: {
    width: '1280px',
    height: `${720 - 40}px`,
    'overflow-y': 'auto'
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

/**
 * Keep size fixed to 1280 * 688,
 * and display scroll automatically
 * 
 * @export
 * @class PageContainer
 * @extends {React.Component}
 */
export default class PageContainer extends React.Component {
  render (){
    return (
      <div className={classes.swipe}>
        {this.props.children}
      </div>
    )
  }
}
