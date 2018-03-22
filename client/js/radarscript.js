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
  var variableNames = ["Crime index", "Population density", "Energy label", "WOZ value", "Green areas", "Households with children", "Nightlife facilities", "Sport facilities"]
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
      var children = Number(d.Households_with_children_2016)
      var nightlife = Number(d.horeca_2016)
      var sport = Number(d.surface_sports_2016)

      var variableValues = [crimeIndex, popDensity, energy, woz, green, children, nightlife, sport]

      // if this region is selected collect data
      if (d.area_code === area_code){
        for (var i=0; i<variableValues.length; i++){
          selected_region[i] = variableValues[i]
        }
      }
      // collect data for all regions
      for(var i=0; i<variableValues.length; i++){
        if (isNumeric(variableValues[i]) && variableValues[i] > 0){
          data[i].push(variableValues[i])
        }
      }
    })

    // calculate the averages of the variables for all regions
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


    // create the different axes
    var d = [[],[]]
    for(var i=0; i<variableNames.length; i++){
      // normalize the datapoints
      var normalized_selected = applyNormalization(data[i],selected_region[i])
      var normalized_all = applyNormalization(data[i],average_all_regions[i])
      // check if bigger than zero
      if(normalized_selected > 0.0){
        d[0].push({axis:variableNames[i],value:normalized_selected})
        d[1].push({axis:variableNames[i],value:normalized_all})
      }
    }

    if(d.length > 0){
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
    }
  })
}

function applyNormalization(data, point){
  var maxValue = Math.max(...data)
  var minValue = Math.min(...data)

  // for(var i=0;i<data.length;i++){
  //   console.log("value",data[i])
  // }

  // console.log("data",data)
  // console.log("point", point)
  // console.log("max", maxValue)
  // console.log("min", minValue)

  var normalized_point = (point - minValue) / (maxValue - minValue)
  // console.log("norm", normalized_point)
  return normalized_point
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

