import 'babel-polyfill'
import { app, BrowserWindow, nativeImage } from 'electron'
import { format } from 'url'
import { join } from 'path'
import * as manager from './manager'
import './store-system'
import { logger } from './log'

import settings from '../app.config.json'
import iconPath from './assets/icon.ico'

// write any exception into winston
// process.on('uncaughtException', error => {
//   logger.log('error', 'uncaughtException', error)
// })

// return index path depending on environment
function getIndexPath (){
  if (process.env.NODE_ENV === 'production'){
    return format({
      pathname: join(app.getAppPath(), 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  }
  else {
    return format({
      pathname: 'index.html',
      hostname: 'localhost',
      port: 8080,
      protocol: 'http:',
      slashes: true
    })
  }
}

let win
let icon = nativeImage.createFromPath(iconPath)

// create window and start system manager
function createWindow() {
  logger.info('app started.')

  manager.enter()

  win = new BrowserWindow({
    title: settings.WINDOW_TITLE,
    width: settings.WINDOW_WIDTH,
    height: settings.WINDOW_HEIGHT,
    minWidth: settings.WINDOW_MIN_WIDTH,
    minHeight: settings.WINDOW_MIN_HEIGHT,
    useContentSize: true,
    autoHideMenuBar: true,
    icon,
    frame: false,
    show: false,
    webPreferences: {
      // trick to load images from external album
      webSecurity: false
    }
  })

  let path = getIndexPath()
  win.loadURL(path)
  // win.webContents.openDevTools()
  if (process.env['NODE_ENV'] !== 'production') {
    win.webContents.openDevTools()
  }

  win.on('closed', () => {
    win = null

    manager.exit()
    app.quit()
  })

  // show window after first rendering
  win.once('ready-to-show', () => {
    win.show()
  })

  let content = win.webContents

  content.on('crashed', error => {
    logger.error('crashed', error)

    manager.exit()
    app.quit()
  })

  content.on('did-fail-load', error => {
    logger.error('did-fail-load', error)

    manager.exit()
    app.quit()
  })
}

app.on('ready', createWindow)

app.on('gpu-process-crashed', error => {
  logger.error('gpu-process-crashed', error)

  manager.exit()
  app.quit()
})
