const nj = require('numjs');

const GradientDescent = function(){
  function _getRandomInARange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function _getAllXFromXYpairs(XYpairs){
    return XYpairs.map(point => parseFloat(Object.keys(point)[0]));
  }

  function _getAllYFromXYpairs(XYpairs){
    return XYpairs.map(point => Object.values(point)[0])
  }

  function _predict(XMatrix, betaVector) {
    let predictedYVector = nj.dot(XMatrix, betaVector);
    // console.log("yVector:");
    // console.log(predictedYVector);
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
      console.log(estimatedConstant);
      
      estimatedConstant = Object.values(estimatedConstant)[0];
      console.log(estimatedConstant);
      
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

  _calculateCostFunction = (numberOfObservation, actualY, predictedYVector) => {
    return (1/2*numberOfObservation)*((actualY.subtract(predictedYVector)).pow(2).sum());
  }

  const runGradientDescent = (XYPairs, learningRate, numberOfIteration, startingApproach) => {
    console.log("Learning Rate : " + learningRate );
    console.log("Number Of Iteration: " + numberOfIteration);
    let X = _getAllXFromXYpairs(XYPairs), Y = _getAllYFromXYpairs(XYPairs);
    let numberOfObservation = X.length;
    console.log(numberOfObservation);
    let onesVector = nj.ones([numberOfObservation, 1]);
    let XVector = nj.array(X).reshape(numberOfObservation, 1);
    let XMatrix = nj.concatenate(onesVector, XVector);
    let betaVector = _startingConstantAndSlope[startingApproach](XYPairs);
    const allCosts = [], allBetas = [];
    let predictedYVector;
    Y = nj.array([Y]).T;

    let gradientConstant = nj.array([[learningRate/numberOfObservation], [learningRate/numberOfObservation]]);
    for (let i = 0; i < numberOfIteration; i++) {
      predictedYVector = _predict(XMatrix, betaVector);
      let diff = predictedYVector.subtract(Y);
      let gd = nj.dot(XMatrix.T, diff);
      let descent = gd.multiply(gradientConstant);
      betaVector.subtract(descent, false);
      allBetas.push(betaVector);
      let cost = _calculateCostFunction(numberOfObservation, Y, predictedYVector);
      allCosts.push(cost);
    }
    console.log("Optimal Betas:");
    console.log(allBetas[allBetas.length-1]);
    return {allBetas: allBetas, allCosts: allCosts, optimalBeta: betaVector};
  }

  const createAndGetDummyData = ( numberOfObservation) => {
    let data = [];
    let yInterceptConstant = _getRandomInARange(1, 10),
      slope = _getRandomInARange(1, 9);
    console.log("Actual Beta0: " + yInterceptConstant + " Actual beta1: " + slope);
    let noiseUpperRange = yInterceptConstant/2;
    for (let index = 0; index < numberOfObservation; index++) {
      let noise;
      if (_getRandomInARange(0, 100) > 15) {
        noise = _getRandomInARange((-1)*noiseUpperRange, noiseUpperRange);
      } else {
         // outlier
         let outlierUpperRange = _getRandomInARange(noiseUpperRange * 2, noiseUpperRange * 4);
        if (_getRandomInARange(0, 100) > 50) noise = _getRandomInARange((-1)*outlierUpperRange, (-1)*noiseUpperRange);
        else noise = _getRandomInARange(noiseUpperRange, outlierUpperRange);
      }
      let x = _getRandomInARange(0, 9999)/1000;
      let y = yInterceptConstant + x * slope + noise;
      //console.log("X and Y's:");
      //console.log(x +' ' +y);
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