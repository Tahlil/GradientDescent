const { globalShortcut, app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron')
const gradientDescent = require('./ML/gradientDescent');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
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
  let data = gradientDescent.createAndGetDummyData(1000, 1000);
  data = data.map((point)=> {
    let key = Object.keys(point)[0];
    let value = point[key];
    return {regressor: parseInt(key), regressand: value};
  });
  //console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', data)
})