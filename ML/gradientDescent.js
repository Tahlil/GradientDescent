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

  let _startingConstantAndSlopeApproaches = {
    randomApproach: (_) => {
      console.log("Using random approach");
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
      //console.log(estimatedConstant);
      estimatedConstant = Object.values(estimatedConstant)[0];
      let estimatedYIntercept = (medianY - estimatedConstant) / medianX;
      console.log("Estimated constant: " + estimatedConstant + "estimated YIntercept" + estimatedYIntercept);

      let betaVector = nj.array([
        [estimatedConstant],
        [estimatedYIntercept]
      ]);
      console.log("Beta vector: ");
      console.log(betaVector);
      let yVector = nj.dot(XMatrix, betaVector);
      console.log("yVector");
      console.log(yVector);

      return {
        c: estimatedConstant,
        m: estimatedYIntercept
      };
    }
  }

  function _predict(XMatrix, betaVector){
    const predictedYVector =  nj.dot(XMatrix, betaVector);
    return predictedYVector;
  }

  _calculateCostFunction = () => {

  }

  const runGradientDescent = (XYPair, learning_rate) => {
    let X = _getAllXFromXYpairs(XYPair);
    let numberOfObservation = X.length;
    console.log(numberOfObservation);
    let onesVector = nj.ones([numberOfObservation, 1]);
    let XVector = nj.array(X).reshape(numberOfObservation, 1);
    let XMatrix = nj.concatenate(onesVector, XVector);
    console.log(XMatrix);
  }

  const createAndGetDummyData = (numberOfObservation, upperRange) => {
    let data = [];
    let yInterceptConstant = _getRandomInARange(100, 200),
      slope = _getRandomInARange(1, 10);
    console.log("Actual Beta0: " + yInterceptConstant + " Actual beta1: " + slope);

    for (let index = 0; index < numberOfObservation; index++) {
      let noise;
      if (_getRandomInARange(0, 100) > 10) {
        noise = _getRandomInARange(-50, 50);
      } else {
        noise = _getRandomInARange(-500, 500); // outlier
      }
      let x = _getRandomInARange(20, upperRange);
      let y = yInterceptConstant + x * slope + noise;
      data.push({
        [x]: y
      });
    }
    _startingConstantAndSlopeApproaches["roughEstimateApproach"](data);
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