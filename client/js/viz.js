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
              .attr("class", "marker");

          // Add a circle.
          marker.append("circle")
              .attr("r", 4.5)
              .attr("cx", padding)
              .attr("cy", padding);
                    
              //add color
              
          //add tool tip
          var tooltip = d3.select("#scatter").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);
          // tooltip mouseover event handler
          var tipMouseover = function(d) {
             //var color = colorScale(d.manufacturer);
              var html  = d.value.postcode + "<ul>" + //add rooms, woza
                          "<li>House price: " + d.value.house_price + "</li>" + 
                          "<li>Purchase price: " + d.value.purchase_price + "</li>" +
                          "<li>Size: " + d.value.area + "</li>" + 
                          "</ul>";

              tooltip.html(html)
                  .style("left", (d3.event.pageX + 15) + "px")
                  .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                  .duration(200) // ms
                  .style("opacity", .9) // started as 0!
          };
          // tooltip mouseout event handler
          var tipMouseout = function(d) {
              tooltip.transition()
                  .duration(300) // ms
                  .style("opacity", 0); // don't care about position!
          };

                // Add a label.
     

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