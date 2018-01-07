import 'babel-polyfill'
import { app, BrowserWindow, nativeImage, ipcMain } from 'electron'
import { format } from 'url'
import { join } from 'path'
import { exec } from 'child_process'
import * as manager from './manager'
import './store-system'
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')

import settings from '../app.config.json'
import iconPath from './assets/icon@0.125x.png'

process.on('uncaughtException', () => {
  process.abort()
})

const FILE_PATH = format({
  pathname: 'app/index.html',
  protocol: 'file:',
  slashes: true
})

const HTTP_PATH = format({
  pathname: 'index.html',
  hostname: 'localhost',
  port: 8080,
  protocol: 'http:',
  slashes: true
})

const PATH = process.env.NODE_ENV === 'production' ? FILE_PATH : HTTP_PATH

let win
let icon = nativeImage.createFromPath(iconPath)

function createWindow() {
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
    show: false
  })

  win.loadURL(PATH)
  if (process.env['NODE_ENV'] !== 'production') {
    win.webContents.openDevTools()
  }

  win.on('closed', () => {
    win = null
    manager.exit()
    app.quit()
  })

  win.once('ready-to-show', () => {
    win.show()
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
}

app.on('ready', createWindow)

app.on('gpu-process-crashed', () => {
  process.abort()
})
