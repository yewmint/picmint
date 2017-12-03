import { app, BrowserWindow, nativeImage } from 'electron'
import { format } from 'url'
import { join } from 'path'
//import './server'

import settings from '../app.config.json'
import iconPath from '../asset/icon@0.125x.png'

const INDEX_PATH = 'index.html'

let PORT = 3000
let PATH_NAME = INDEX_PATH
if (process.env['NODE_ENV'] === 'production'){
  PORT = settings.SERVER_PORT
  PATH_NAME = join('dist', INDEX_PATH)
}

const HTTP_PATH = format({
  pathname: PATH_NAME,
  hostname: 'localhost',
  port: PORT,
  protocol: 'http:',
  slashes: true
})

let win
let icon = nativeImage.createFromPath(join('dist', iconPath))

function createWindow () {
  win = new BrowserWindow({
    title: settings.WINDOW_TITLE,
    width: settings.WINDOW_WIDTH, 
    height: settings.WINDOW_HEIGHT,
    resizable: true,
    useContentSize: true,
    autoHideMenuBar: true,
    icon,
    frame: false
  })

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
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
