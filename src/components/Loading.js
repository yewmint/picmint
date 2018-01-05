import { h } from 'hyperapp'
import FullPage from './FullPage'
import { tween, styler, easing } from 'popmotion'
import { rpc } from '../utils'

const rotate = ele => {
  tween({ 
    from: 0,
    to: 360, 
    duration: 2000,
    loop: Infinity,
    ease: easing.linear,
  }).start(styler(ele).set('rotate'))
}

rpc.listen('store-did-open', () => {
  window.app.switchPage('search')
  window.app.setWhiteTitle(true)
})

export default ({ name }) => (
  <FullPage name={name} center={true}>
    <div class="loading">
      <h2>Loading store, take a sip of coffee ☕</h2>
      <div class="loading-icon">
        <i 
          oncreate={rotate} 
          onupdate={rotate} 
          class="material-icons"
        >
          donut_large
        </i>
      </div>
    </div>
  </FullPage>
)