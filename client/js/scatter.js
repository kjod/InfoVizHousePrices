var EMPLOYMENTSWITCH = false;

const DATASETS = {"funda": {name:"funda", dataset: "funda_data.json"}} 



/**
Plots scatter onto google map
datasetDict: indlcued incase scatter is used for different data sets.
key: used to determine which value in dataset will be used for colouring.
*/
function scatterPlot(datasetDict, key) {
    var width = 960, height = 500;
    d3.json("funda_data.json", function(data) {
      
      var arr = data.map(o => o[key]);
      let maxValue = Math.max(...arr)
      let minValue = Math.min(...arr)

      const colorScale = d3.scaleLinear()
        .domain([minValue, minValue + 500000, (minValue + maxValue)/2, maxValue])
        .range([ "yellow", "orange", "red" ,"green"]);

      legendFormatter(colorScale, "top", key, "scatter", maxValue, minValue)

      var overlay = new google.maps.OverlayView();    
      overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "scatterpoints")//change to only use id
        .attr("id", "scatterpoints");

        overlay.draw = function() {
          var projection = this.getProjection();
          var padding = 10; 

          var marker = layer.selectAll("svg")
              .data(d3.entries(data))
              .each(transform) // update existing markers
              .enter().append("svg")
              .each(transform)
              .style('fill', function(d) {
                  //console.log("redBlueScaleColor ", d.value.house_price);
                  return colorScale(d.value.house_price);
              })
              .attr("class", "marker")
              .on("click", function(d) { console.log(d); });

          // Add a circle.
          marker.append("circle")
              .attr("r", 4.5)
              .attr("cx", padding)
              .attr("cy", padding)
              .attr("class", "scatterCircle")
               .on("mouseover", function(d) {   
                  console.log("outside I'm in");
              }); 
              // /.attr('pointer-events', 'all')
          google.maps.event.addListener(marker , 'click', function(ev) {
            console.log("clicked bitch")
          });

              //.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
              //.on("mouseout", function(){return tooltip.style("visibility", "hidden");});;
                    
              //add color
              

          function transform(d) {
            //console.log(d)
            //g.h;
            d = new google.maps.LatLng(d.value.lat, d.value.lon);
            d = projection.fromLatLngToDivPixel(d);
            return d3.select(this)
                .style("left", (d.x - padding) + "px")
                .style("top", (d.y - padding) + "px");
          }
        };
      };
          // Bind our overlay to the map…
      overlay.setMap(map);
  });

}

var houseProcesSwitch = false;

function drawLayers(layer){
    console.log("Layer ", layer)
    //remove div if it exists
    //add div
    if(layer === "house_price"){
      if(!houseProcesSwitch) { scatterPlot(DATASETS["funda"], layer) }
      else {  
        document.getElementsByClassName("scatter")[0].remove(); 
        document.getElementsByClassName("scatterpoints")[0].remove();
      }
      houseProcesSwitch = !houseProcesSwitch;
    }

    //add everything
    
    //draw scatter layer last, doesn't matter
}