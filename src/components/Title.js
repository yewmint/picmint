import { h } from 'hyperapp'
import { remote } from 'electron'
import { WINDOW_TITLE } from '../../app.config.json'

const TitleButton = ({ callback, white }, children) => {
  let className = 'title-btn'
  if (white){
    className += ' white'
  }

  return (
    <button class={className} onclick={callback}>
      {children}
    </button>
  )
}

const win = remote.getCurrentWindow()

const minimize = () => win.minimize()

const maxmize = () => {
  if (win.isMaximized()){
    win.unmaximize()
  }
  else {
    win.maximize()
  }
}

const close = () => win.close()



export default ({ white }) => {
  let textClass = 'title-text'
  if (white){
    textClass += ' white'
  }

  return (
    <div class="title">
      <div class={textClass}>
        { WINDOW_TITLE }
      </div>
      <div class="title-drag"></div>
      <div>
        <TitleButton white={white} callback={minimize}>
          <i class="material-icons">remove</i>
        </TitleButton>
        <TitleButton white={white} callback={maxmize}>
          <i class="material-icons">crop_square</i>
        </TitleButton>
        <TitleButton white={white} callback={close}>
          <i class="material-icons">clear</i>
        </TitleButton>
      </div>
    </div>
  )
}