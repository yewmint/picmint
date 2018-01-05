import _ from 'lodash'
import { join } from 'path'
import { SERVER_PORT } from '../app.config.json'

export const repaint = () => state => ({ ...state })

export const switchPage = page => {
  return state => ({ ...state, page })
}

export const setWhiteTitle = isWhite => {
  return state => ({ ...state, whiteTitle: isWhite })
}

export const updatePictures = pictures => {
  let base = `http://127.0.0.1:${SERVER_PORT}/`
  pictures.forEach(
    picture => picture.url = base + picture.path
  )

  return state => ({ ...state, pictures })
}

export const showDetail = picture => {
  window.$('#myModal').modal()
  return state => ({ ...state, detailPicture: picture })
}