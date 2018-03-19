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
  //Data crimeindex, popDensity, energy, houseprices, nationalities
  var selected_region = [0.0,0.0,0.0,0.0]
  var average_all_regions = [0.5,0.5,0.5,0.5]
  var area_clicked = null

  d3.json("names_coordinates_data/districts.json", function(shapes) {
      var counter = 0
      shapes.Areas.forEach(function(d){
        counter += 1
        if (d.area_code === area_code){
          selected_region[0] = d.Crime_index_2016;
          selected_region[1] = d.Population_density_2016;
          selected_region[2] = d.energy_label_2016;
          selected_region[3] = d.WOZ_value_2016;
        }
        // average_all_regions[0] += d.Crime_index_2016;
        // average_all_regions[1] += d.Population_density_2016;
        // average_all_regions[2] += d.energy_label_2016;
        // average_all_regions[3] += d.WOZ_value_2016;
      })
      // average_all_regions[0] /= counter
      // average_all_regions[1] /= counter
      // average_all_regions[2] /= counter
      // average_all_regions[3] /= counter

      console.log(selected_region)
      console.log(average_all_regions)


    //Legend titles
    var LegendOptions = [area_name, 'Average of all regions'];

    var d = [
        [
        {axis:"Crime index",value:selected_region[0]},
        {axis:"Population density",value:selected_region[1]},
        {axis:"Energy label",value:selected_region[2]},
        {axis:"WOV Value",value:selected_region[3]},
        ],[
        {axis:"Crime index",value:average_all_regions[0]},
        {axis:"Population density",value:average_all_regions[1]},
        {axis:"Energy label",value:average_all_regions[2]},
        {axis:"WOZ Value",value:average_all_regions[3]},
        ]
      ];

    RadarChart.draw("#overviewChart", d, mycfg);
    var svg = d3.select('#overviewChart')
    .selectAll('svg')
    .append('svg')
    .attr("width", w+300)
    .attr("height", h)

  // //Create the title for the legend
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
////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

