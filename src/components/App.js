import { h } from 'hyperapp'
import _ from 'lodash'
import Title from './Title'
import Welcome from './Welcome'
import Loading from './Loading'
import Search from './Search'

const PAGES = {
  'welcome': Welcome,
  'loading': Loading,
  'search': Search
}

export default ({ page, whiteTitle, pictures, showDetail }) => {
  let RenderPage = PAGES[page]
  if (!_.isFunction(RenderPage)){
    console.error('Can not find page: ', page)
  }

  return (
    <div class="app">
      <Title white={whiteTitle} />
      <RenderPage name={page} pictures={pictures} showDetail={showDetail} />
    </div>
  )
}