var EMPLOYMENTSWITCH = false;

const DATASETS = {"funda": {name:"funda", dataset: "funda_data.json"}} 

//Need filterSet??
function scatterPlot(datasetDict) {
    d3.json("funda_data.json", function(data) {
      console.log("data")
      console.log(data)
         
      var overlay = new google.maps.OverlayView();    
      overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "scatter")//change to only use id
        .attr("id", "scatter");
      
        overlay.draw = function() {
          var projection = this.getProjection();
          var padding = 10;

          var marker = layer.selectAll("svg")
              .data(d3.entries(data))
              .each(transform) // update existing markers
              .enter().append("svg")
              .each(transform)
              .attr("class", "marker")

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
    if(layer === "house_prices"){
      if(!houseProcesSwitch) { scatterPlot(DATASETS["funda"]) }
      else {  document.getElementsByClassName("scatter")[0].remove(); }
      houseProcesSwitch = !houseProcesSwitch;
    }

    //add everything
    
    //draw scatter layer last
}