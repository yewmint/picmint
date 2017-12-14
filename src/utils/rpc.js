import _ from 'lodash'
import { ipcRenderer, ipcMain, webContents } from 'electron'

let ipc = { on: _.noop, sendSync: _.noop }
if (process.type === 'browser'){
  ipc = ipcMain
}
else if (process.type === 'renderer'){
  ipc = ipcRenderer
}

function listen (eventName = 'default', func = _.noop){
  eventName = 'rpc-' + eventName
  ipc.on(eventName, (ev, arg) => {
    ev.returnValue = func(arg)
  })
}

function call (eventName = 'default', args = {}){
  eventName = 'rpc-' + eventName
  return ipc.sendSync(eventName, args) || null
}

function callAsync (eventName = 'default', args = {}){
  eventName = 'rpc-' + eventName
  ipc.send(eventName, args)
}

function mainCallAsync (eventName = 'default', args = {}){
  eventName = 'rpc-' + eventName
  webContents.getAllWebContents()[0].send(eventName, args)
}

export const rpc = {
  listen,
  call,
  callAsync,
  mainCallAsync
}