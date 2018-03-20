var w = 400,
  h = 400;

var colorscale = d3.scaleOrdinal(d3.schemeCategory10);




//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 1,
  levels: 10,
  ExtraWidthX: 300
}


//Call function to draw the Radar chart
//Will expect that data is in %'s
function initGraph(area_code, area_name){
  // variables:
  var variableNames = ["Crime index", "Pop. density", "Energy label", "WOZ value", "Green areas"]
  //  

  // initialize list for the selected region variables
  var selected_region = Array.apply(null, Array(variableNames.length)).map(Number.prototype.valueOf,0);

  // data
  var data = []
  for(var i=0; i<variableNames.length;i++){
    data.push([])
  }

  var area_clicked = null

  d3.json("names_coordinates_data/districts.json", function(shapes) {
      var counter = 0
      shapes.Areas.forEach(function(d){
        counter += 1

        // variables
        var crimeIndex = Number(d.Crime_index_2016)
        var popDensity = Number(d.Population_density_2016)
        var energy = Number(d.energy_label_2016)
        var woz = Number(d.WOZ_value_2016)
        var green = Number(d.surface_green_2016)

        var variableValues = [crimeIndex, popDensity, energy, woz, green]

        // if this region is selected collect data
        if (d.area_code === area_code){
          for (var i=0; i<variableValues.length; i++){
            selected_region[i] = variableValues[i]
          }
        }
        // collect data for all regions
        for(var i=0; i<variableValues.length; i++){
          if (isNumeric(variableValues[i]) && variableValues[i] != 0){
            data[i].push(variableValues[i])
          }
        }
      })
      var average_all_regions = []
      for (var i=0; i<data.length; i++){
        var sum = 0
        for (var j=0; j<data[i].length; j++){
          if (!isNaN(data[i][j])){
            sum += data[i][j]
          }
        }
        average_all_regions.push(sum/data[i].length)
      }

    //Legend titles
    var LegendOptions = [area_name, 'Average of all regions'];

    var d = [
        [
        {axis:variableNames[0],value:applyNormalization(data[0],selected_region[0])},
        {axis:variableNames[1],value:applyNormalization(data[1],selected_region[1])},
        {axis:variableNames[2],value:applyNormalization(data[2],selected_region[2])},
        {axis:variableNames[3],value:applyNormalization(data[3],selected_region[3])},
        {axis:variableNames[4],value:applyNormalization(data[4],selected_region[4])},
        ],[
        {axis:variableNames[0],value:applyNormalization(data[0], average_all_regions[0])},
        {axis:variableNames[1],value:applyNormalization(data[1],average_all_regions[1])},
        {axis:variableNames[2],value:applyNormalization(data[2],average_all_regions[2])},
        {axis:variableNames[3],value:applyNormalization(data[3],average_all_regions[3])},
        {axis:variableNames[4],value:applyNormalization(data[4],average_all_regions[4])},
        ]
      ];

    RadarChart.draw("#overviewChart", d, mycfg);
    var svg = d3.select('#overviewChart')
    .selectAll('svg')
    .append('svg')
    .attr("width", w+300)
    .attr("height", h)

  //Create the title for the legend
  // var text = svg.append("text")
  //   .attr("class", "title")
  //   .attr('transform', 'translate(90,10)') 
  //   .attr("x", w - 70)
  //   .attr("y", 10)
  //   .attr("font-size", "20px")
  //   .attr("fill", "#404040")
  //   .text("Legend");
      
  //Initiate Legend 
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 200)
    .attr('transform', 'translate(90,20)') 
    ;
    //Create colour squares
    legend.selectAll('rect')
      .data(LegendOptions)
      .enter()
      .append("rect")
      .attr("x", w - 65)
      .attr("y", function(d, i){ return i * 25 + 9;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i){ return colorscale(i);})
      ;
    //Create text next to squares
    legend.selectAll('text')
      .data(LegendOptions)
      .enter()
      .append("text")
      .attr("x", w - 52)
      .attr("y", function(d, i){ return i * 25 + 20;})
      .attr("font-size", "22px")
      .attr("fill", "#737373")
      .text(function(d) { return d; })
      ; 

  })
}

function applyNormalization(data, point){
  var maxValue = Math.max(...data)
  var minValue = Math.min(...data)

  // for(var i=0;i<data.length;i++){
  //   console.log("value",data[i])
  // }

  console.log("data",data)
  console.log("point", point)
  console.log("max", maxValue)
  console.log("min", minValue)

  var normalized_point = (point - minValue) / (maxValue - minValue)
  console.log("norm", normalized_point)
  return normalized_point
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

