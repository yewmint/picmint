import { h } from 'hyperapp'

function clickThumbnail (picture){
  window.app.showDetail(picture)
}

const Thumbnail = (picture) => {
  let style = {
    'background-image': `url('${picture.url}')`
  }

  return (
    <div class="thumbnail-frame"> 
      <div 
        class="thumbnail" 
        style={style} 
        onclick={() => clickThumbnail(picture)} 
      ></div>
    </div>
  )
}

export default ({ pictures }) => {
  return (
    <div class="picture-list">
      {pictures.map(({ url }) => <Thumbnail key={url} url={url} />)}
    </div>
  )
}