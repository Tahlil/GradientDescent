const nj = require('numjs');

const GradientDescent = function(){
  function _getRandomInARange(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
  }

  function _getAllXFromXYpairs(XYpairs){
    return XYpairs.map(point => parseInt(Object.keys(point)[0]));
  }

  function _getAllYFromXYpairs(XYpairs){
    XYpairs.map(point => Object.values(point)[0])
  }

  function _predict(XMatrix, betaVector) {
    let predictedYVector = nj.dot(XMatrix, betaVector);
      console.log("yVector:");
      console.log(predictedYVector);
      return predictedYVector;
  }

  let _startingConstantAndSlope = {
    randomApproach: (_) => {
      console.log("Using random approach");
      return nj.random([2, 1]);
    },
    roughEstimateApproach: (XYpairs) => {
      console.log("Using rough estimation approach");
      let X = _getAllXFromXYpairs(XYpairs),
        Y = _getAllYFromXYpairs(XYpairs);
      let numberOfObservation = X.length;
      console.log(numberOfObservation);
      let medianX = X.sort()[Math.floor(numberOfObservation / 2)];
      console.log("Median X: " + medianX);
      let medianY = Y.sort()[Math.floor(numberOfObservation / 2)];
      console.log("Median Y: " + medianY);
      let minX = Math.min(...X);
      console.log("Min X: " + minX);
      let estimatedConstant = XYpairs.filter(item => Object.keys(item)[0] == minX)[0];
      estimatedConstant = Object.values(estimatedConstant)[0];
      let estimatedYIntercept = (medianY - estimatedConstant) / medianX;
      console.log("Estimated constant: " + estimatedConstant + "estimated YIntercept" + estimatedYIntercept);
      const betaVector = nj.array([
        [estimatedConstant],
        [estimatedYIntercept]
      ]);
      console.log("Beta vector: ");
      console.log(betaVector);
      return betaVector;
    }
  }

  function _predict(XMatrix, betaVector){
    const predictedYVector =  nj.dot(XMatrix, betaVector);
    return predictedYVector;
  }

  _calculateCostFunction = (numberOfObservation, actualY, predictedYVector) => {
    return (1/2*numberOfObservation)*((actualY.subtract(predictedYVector)).pow(2).sum());
  }

  const runGradientDescent = (XYPairs, learningRate, numberOfIteration, startingApproach) => {
    let X = _getAllXFromXYpairs(XYPairs), Y = _getAllYFromXYpairs(XYPairs);
    let numberOfObservation = X.length;
    console.log(numberOfObservation);
    let onesVector = nj.ones([numberOfObservation, 1]);
    let XVector = nj.array(X).reshape(numberOfObservation, 1);
    let XMatrix = nj.concatenate(onesVector, XVector);
    let betaVector = _startingConstantAndSlope[startingApproach](XYPairs);
    const allCosts = [], allBetas = [];
    let predictedYVector;
    for (let i = 0; i < numberOfIteration; i++) {
      predictedYVector = _predict(XMatrix, betaVector);
      betaVector -= X.T.dot(predictedYVector.subtract(Y)).multiply(learningRate/numberOfObservation); 
      allBetas.push(betaVector);
      let cost = _calculateCostFunction(numberOfObservation, Y, predictedYVector);
      allCosts.push(cost);
    }
    console.log("Optimal Beta0: " + betaVector[0][0]);
    console.log("Optimal Beta1: " + betaVector[0][1]);
    return {allBetas: allBetas, allCosts: allCosts, optimalBeta: betaVector};
  }

  const createAndGetDummyData = (numberOfObservation, upperRange) => {
    let data = [];
    let yInterceptConstant = _getRandomInARange(100, 200),
      slope = _getRandomInARange(1, 10);
    console.log("Actual Beta0: " + yInterceptConstant + " Actual beta1: " + slope);

    for (let index = 0; index < numberOfObservation; index++) {
      let noise;
      if (_getRandomInARange(0, 100) > 19) {
        noise = _getRandomInARange((-1)*upperRange, upperRange);
      } else {
         // outlier
        if (_getRandomInARange(0, 100) > 50) noise = _getRandomInARange(_getRandomInARange(-3000, -1500), (-1)*upperRange);
        else noise = _getRandomInARange(upperRange, _getRandomInARange(1500, 3500));
        
      }
      let x = _getRandomInARange(100, upperRange)*2;
      let y = yInterceptConstant + x * slope + noise + upperRange;
      data.push({
        [x]: y
      });
    }
    return {
      data: data,
      beta0: yInterceptConstant,
      beta1: slope
    };
  }

  return {
    createAndGetDummyData: createAndGetDummyData,
    runGradientDescent: runGradientDescent
  }
}();

module.exports = GradientDescent;