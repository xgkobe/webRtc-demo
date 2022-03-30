
const { app, BrowserWindow } = require('electron');
// const {getPreUrl} = require('./utils/index');
const path = require('path');
const ENV = process.env.NODE_ENV;

let preload_path = path.join(__dirname, './src/renderer/preload.js');
console.log(ENV);
if (ENV === 'production') {
  preload_path = path.join(__dirname, 'preload.js')
}



function createWindow () {
      const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: preload_path,
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
      icon: path.join(__dirname, './static/icon.png'),
    })
  
    require('@electron/remote/main').initialize() // 初始化
    require('@electron/remote/main').enable(win.webContents)
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
    // win.webContents.openDevTools();
    process.stdout.write('哈哈我叫徐光');
  }
  app.whenReady().then(() => {
    createWindow();
  })

