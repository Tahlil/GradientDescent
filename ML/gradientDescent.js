const { Matrix } = require('ml-matrix');

let startingBeta1AndBeta2Approaches = {
  randomApproach: (_, __) => {

  },
  roughEstimateApproach: (XYpairs) => {
    let medians = XYpairs.reduce((previous, current) => {
      
    }, [{sumX: 0, sumY: 0}]);
    let medianX = X.sort()[Math.floor(X.length/2)];
    let medianY = Y.sort()[Math.floor(Y.length/2)];

  }
}

function _getRandomInARange(min, max) {
  return Math.random() * (max - min) + min;
}

_calculateCostFunction = () => {

}

runGradientDescent = (X, Y, learning_rate) => {

}

const createAndGetDummyData = (numberOfObservation, upperRange) => {
  let data = [];
  let yInterceptConstant = _getRandomInARange(100, 200), slope = _getRandomInARange(1, 10);
  for (let index = 0; index < numberOfObservation; index++) {
    let noise;
    if(_getRandomInARange(0, 100)> 10){
      noise = _getRandomInARange(-50, 50); 
    }
    else{
      noise = _getRandomInARange(-500, 500); // outlier
    }
    let x = _getRandomInARange(20, upperRange);
    let y = yInterceptConstant + x*slope +noise;
    data.push({[x]: y});
  }
  console.log(data);
  return data;
}

module.exports = {
  createAndGetDummyData: createAndGetDummyData,
  runGradientDescent: runGradientDescent
}