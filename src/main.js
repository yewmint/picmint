import { app, BrowserWindow, nativeImage } from 'electron'
import { format } from 'url'
import { join } from 'path'
import { SetVibrancy } from 'electron-vibrancy'
import server from './server'

import settings from '../app.config.json'
import iconPath from '../asset/icon@0.125x.png'

const INDEX_PATH = 'index.html'

const HTTP_PATH = format({
  pathname: join('dist', INDEX_PATH),
  hostname: '127.0.0.1',
  port: settings.SERVER_PORT,
  protocol: 'http:',
  slashes: true
})

// const FILE_PATH = format({
//   pathname: join('dist', INDEX_PATH),
//   protocol: 'file:',
//   slashes: true
// })

let win
let icon = nativeImage.createFromPath(join('dist', iconPath))

function createWindow () {
  win = new BrowserWindow({
    title: settings.WINDOW_TITLE,
    width: settings.WINDOW_WIDTH, 
    height: settings.WINDOW_HEIGHT,
    resizable: false,
    useContentSize: true,
    autoHideMenuBar: true,
    icon,
    transparent: true,
    frame: false
  })

  SetVibrancy(win, 1)

  win.loadURL(HTTP_PATH)
  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
    app.quit()
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    server.close()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
