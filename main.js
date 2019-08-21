const { globalShortcut, app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron')
const gradientDescent = require('./ML/gradientDescent');

let win;

class DesktopApp {

  constructor() {
    this.createWindow();
  }
  
  createWindow () {
      win = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
          nodeIntegration: true
        }
      })
      globalShortcut.register('f5', function() {
        console.log('f5 is pressed')
        win.reload()
      })
      globalShortcut.register('CommandOrControl+R', function() {
        console.log('CommandOrControl+R is pressed')
        win.reload()
      })
      win.loadFile('index.html')
    
      win.webContents.openDevTools()
    
      win.on('closed', () => {
        win = null
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
    
    ipcMain.on('get-data', (event, arg) => {
      let allInfos = gradientDescent.createAndGetDummyData(10, 1000);
      let data = allInfos.data;
      data = data.map((point)=> {
        let key = Object.keys(point)[0];
        let value = point[key];
        return {regressor: parseInt(key), regressand: value};
      });
      //console.log(arg) // prints "ping"
      event.sender.send('asynchronous-reply', data);
    })
    
    
    ipcMain.on('run-GD-algo', (event, arg) => {
      let allInfos = gradientDescent.createAndGetDummyData(10, 1000);
      let data = allInfos.data;
      data = data.map((point)=> {
        let key = Object.keys(point)[0];
        let value = point[key];
        return {regressor: parseInt(key), regressand: value};
      });
      //console.log(arg) // prints "ping"
      event.sender.send('asynchronous-reply', data);
    })
  
}

module.exports = DesktopApp;