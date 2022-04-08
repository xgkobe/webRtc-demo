const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('electron', {
  fs,
  ipcRenderer: {
    openDialog() {
      ipcRenderer.send('open-dialog', 'ping');
    },
    
    on(channel: string, func: Function) {
      const validChannels = ['ipc-example', 'open-dialog'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      }
    },
    
    once(channel: string, func: Function) {
      const validChannels = ['open-dialog'];
      if (validChannels.includes(channel)) {
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});
  
  