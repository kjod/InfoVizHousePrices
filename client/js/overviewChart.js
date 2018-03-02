/* implementation heavily influenced by http://bl.ocks.org/1166403 */
//include filter set and type of graph
function initGraph(){
	var margin = {top: 50, right: 50, bottom: 50, left: 50};	
	var width = parseInt(d3.select("#overviewChart").style("width"),10);
  	//var height = parseInt(d3.select("#overviewChart").style("height"),10);
  	//var width = 200;
  	var height = 200;
  	console.log("Width ", width)
  	console.log("Height ", height)
  	var n = 21;

	var xScale = d3.scaleLinear()
	    .domain([0, n-1]) // input
	    .range([0, width]); // output

	var yScale = d3.scaleLinear()
	    .domain([0, 1])
	    .range([height, 0]); 

	var line = d3.line()
	    .x(function(d, i) { return xScale(i); }) 
	    .y(function(d) { return yScale(d.y); })  
	    .curve(d3.curveMonotoneX) 

	var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
	var svg = d3.select("#overviewChart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .attr("class", "horizon horizon_small");

	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(xScale));

	svg.append("g")
	    .attr("class", "y axis")
	    .call(d3.axisLeft(yScale)); 

	svg.append("path")
	    .datum(dataset)
	    .attr("class", "line")
	    .attr("d", line);

	svg.selectAll(".dot")
	    .data(dataset)
	  .enter().append("circle")
	    .attr("class", "dot")
	    .attr("cx", function(d, i) { return xScale(i) })
	    .attr("cy", function(d) { return yScale(d.y) })
	    .attr("r", 5);
 }