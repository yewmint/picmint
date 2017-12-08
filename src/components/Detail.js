import React from 'react'
import classname from 'classname'
import PropTypes from 'prop-types'
import { rpc } from '../utils'
import Page from './Page'
import _ from 'lodash'
import DetailInfo from './DetailInfo'
import DetailImage from './DetailImage'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

const styles = {
  detail: {
    display: 'grid',
    'grid-template-columns': '240px auto',
    'grid-template-rows': '100%',
    'align-items': 'stretch',
  }
}

const { classes } = jss.createStyleSheet(styles).attach()

class Detail extends React.Component {
  constructor (props){
    super(props)

    let result = rpc.call('db-get-img', Number.parseInt(props.id))
    if (result.success) {
      this.img = result.img
    }
  }

  render (){
    if (!this.img){
      return (<div />)
    }

    let img = this.img
    let src = `/store/imgs/${img.archive}/${img.id}.jpg`

    return (
      <div className={classes.detail}>
        <DetailInfo img={img} />
        <DetailImage src={src} width={img.width} height={img.height} />
      </div>
    )
  }
}

Detail.defaultProps = {
}

Detail.propTypes = {
  id: PropTypes.string
}

/**
 * wrap Detail to accept params as props from Page
 */
export default () => (
  <Page path="/detail/:id">
    <Detail />
  </Page>
)