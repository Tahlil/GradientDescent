const { globalShortcut, app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron')
const gradientDescent = require('./ML/gradientDescent');

let win;

class DesktopApp {
  constructor() {
    this.app = app;
    this.ipcMain = ipcMain;
    this.setUpApp();
    this.setUpGDListener();
    this.currentData = null;
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
    
    setUpApp(){
      this.app.on('ready', this.createWindow)
    
      this.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          this.app.quit()
        }
      })
      
      this.app.on('activate', () => {
        if (win === null) {
          this.createWindow()
        }
      })
    }

    setUpDataListener(){
      this.ipcMain.on('get-data', (event, arg) => {
        let allInfos = gradientDescent.createAndGetDummyData(1000, 1000);
        let data = allInfos.data;
        this.currentData = data;
        data = data.map((point)=> {
          let key = Object.keys(point)[0];
          let value = point[key];
          return {regressor: parseInt(key), regressand: value};
        });
        event.sender.send('asynchronous-reply', data);
      })
    }

    setUpGDAlgoListener(){
      ipcMain.on('run-GD-algo', (event, hyperParameters) => {
        endResult = {};
        if(this.currentData === null){
          endResult.success = false;
        }
        else{
          endResult.success = true;
          let learningRate = hyperParameters.learningRate,
          numberOfIteration = hyperParameters.numberOfIteration,
          startingMethod = hyperParameters.selectedMethod;
          endResult.result = gradientDescent.runGradientDescent(this.currentData, learningRate, numberOfIteration, startingMethod);
          endResult.summary = "Hyperparameters Used: " + "\nLearning Rate: " + learningRate + "\nNumber of Iteration: " + numberOfIteration + "\nStrating bete prediction method: " + startingMethod;
        }
        // let allInfos = gradientDescent.createAndGetDummyData(10, 1000);
        // let data = allInfos.data;
        // data = data.map((point)=> {
        //   let key = Object.keys(point)[0];
        //   let value = point[key];
        //   return {regressor: parseInt(key), regressand: value};
        // });
        //console.log(arg) // prints "ping"
        event.sender.send('end-GD-algo', endResult);
      }) 
    }

    setUpGDListener() {
      this.setUpDataListener();
      this.setUpGDAlgoListener();
    }
}

module.exports = DesktopApp;