
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { resolveHtmlPath } = require('./util.ts');
import path from 'path';
const ENV = process.env.NODE_ENV;

let preload_path = path.join(__dirname, 'preload.ts');


console.log('是否被打包' + app.isPackaged);
console.log('当前环境：'+ ENV);
let win: any;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preload_path,
      nodeIntegration: true,
      // contextIsolation: false,
      allowRunningInsecureContent: true,
      webSecurity: false,
    },
    icon: path.join(__dirname, '../../static/ico.png'),
  })
  win.setOverlayIcon( path.join(__dirname, '../../static/ico.png'), 'Description for overlay');
  win.loadURL(resolveHtmlPath('index.html'));
  require('@electron/remote/main').initialize(); // 初始化
  require('@electron/remote/main').enable(win.webContents);
    
    
  win.webContents.openDevTools();
  win.addListener("close", () => {
    win = null;
  })
}

app.whenReady().then(() => {
  createWindow();
})

ipcMain.on('open-dialog', async (event) => {
  let path = dialog.showSaveDialogSync(win, {
                  title: '保存文件',
                  defaultPath: 'ScreenData.webm',
              });
  event.reply('open-dialog', path);
});

