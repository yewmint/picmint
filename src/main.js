import { app, BrowserWindow, nativeImage, ipcMain } from 'electron'
import { format } from 'url'
import { join } from 'path'
import { exec } from 'child_process'
import { manager } from './system'
//import './server'

import settings from '../app.config.json'
import iconPath from '../asset/icon@0.125x.png'

const INDEX_PATH = '/'

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
    resizable: false,
    useContentSize: true,
    autoHideMenuBar: true,
    icon,
    frame: false,
    show: false
  })

  win.loadURL(HTTP_PATH)
  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
    app.quit()
  })

  ipcMain.on('open-image', (ev, url) => {
    let imgPath = join(app.getAppPath(), 'dist', url)
    exec(`start ${imgPath}`)
  })

  manager.enter()
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    manager.leave()
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
