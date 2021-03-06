function plotData(allInfo) {
  let data = allInfo.data, b0 = allInfo.b0, b1 = allInfo.b1, fittingData= []; 
  //console.log(data);
  console.log("b0: " + b0 + "b1: " + b1);
  for (var i = 0.0; i < 10; i+=0.01) {
    var point = {x: i, y: (b0 + b1*i)};
    fittingData.push(point); 
  }
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
  // append the svg object to the body of the page
  var svg = d3.select("#original")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 0])
    .range([ 0, width ]);
  svg.append("g")
    .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("opacity", "0")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.regressor); } )
      .attr("cy", function (d) { return y(d.regressand); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

  // new X axis
  x.domain([0, 10])
  svg.select(".myXaxis")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));

  svg.selectAll("circle")
    .transition()
    .delay(function(d,i){return(i*3)})
    .duration(2000)
    .attr("cx", function (d) { return x(d.regressor); } )
    .attr("cy", function (d) { return y(d.regressand); } )
 
    svg.append('g')
    .selectAll("dot")
    .data(fittingData)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 1.5)
      .style("fill", "#ff474c")

}