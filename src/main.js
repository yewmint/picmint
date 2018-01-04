import 'babel-polyfill'
import { app, BrowserWindow, nativeImage, ipcMain, dialog } from 'electron'
import { format } from 'url'
import { join } from 'path'
import { exec } from 'child_process'
import { manager } from './system'
import server from './server'

import settings from '../app.config.json'
import iconPath from '../asset/icon@0.125x.png'

process.on('uncaughtException', () => {
  process.abort()
})

const INDEX_PATH = '/'

let PORT = 3000
let PATH_NAME = INDEX_PATH
if (process.env['NODE_ENV'] === 'production'){
  PORT = settings.SERVER_PORT
}

const HTTP_PATH = format({
  pathname: PATH_NAME,
  hostname: 'localhost',
  port: PORT,
  protocol: 'http:',
  slashes: true
})

let win
let icon = nativeImage.createFromPath(iconPath)

function createWindow () {
  process.rootPath = app.getAppPath()

  server.start()

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
  // if (process.env['NODE_ENV'] !== 'production'){
  //   win.webContents.openDevTools()
  // }

  win.on('closed', () => {
    win = null
    manager.leave()
    server.stop()
    app.quit()
  })

  let content = win.webContents

  content.on('crashed', () => {
    process.abort()
  })

  content.on('did-fail-load', () => {
    process.abort()
  })

  ipcMain.on('open-image', (ev, url) => {
    let imgPath = join(process.resourcesPath, 'app', url)
    exec(`start ${imgPath}`)
  })

  manager.enter()
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    manager.leave()
    server.stop()
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    dialog.showErrorBox('error', app.getAppPath())
    //createWindow()
  }
})

app.on('gpu-process-crashed', () => {
  process.abort()
})
