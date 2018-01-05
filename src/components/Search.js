import { h } from 'hyperapp'
import FullPage from './FullPage'
import { rpc } from '../utils'
import PictureList from './PictureList'
import PictureDetail from './PictureDetail'

function submit (ev){
  ev.preventDefault()

  if (!input) return
  let words = input.value

  rpc.call('store-search', { words })
}

let input = null

rpc.listen(
  'store-did-search', 
  ({ result }) => {
    window.app.updatePictures(result)
  }
)

function inputCreate (ele){
  input = ele
  input.focus()
}

export default ({ name, pictures, showDetail }) => (
  <FullPage name={name} center={false}>
    <div class="search">
      <form class="search-bar" onsubmit={ev => submit(ev)}>
        <div class="search-frame">
          <input 
            placeholder="Time to search :)" 
            oncreate={inputCreate} 
          />
          <button type="submit">
            <i class="material-icons">play_arrow</i>
          </button>
        </div>
      </form>
      <div class="search-list">
        <PictureList pictures={pictures} />
      </div>
    </div>
    <PictureDetail show={showDetail} />
  </FullPage>
)