var EMPLOYMENTSWITCH = false;

const DATASETS = {"BRK": {name:"BRK", dataset: "combined_bag_brk.csv"}} 


function scatterFormatter (dataset, data){
  if(dataset === "BRK"){
        //add tooltip
        //get scale
        //add color for scale
        //set up legend 
  } else {
    return data;
  }
}

//Need filterSet??
//Might need to pus these into one file, if we wnat heat maps
function scatterPlot(datasetDict) {
    
    console.log(datasetDict.dataset)
    d3.csv(datasetDict.dataset, function(data) {
          //console.log("Error ", error);
         //if (error) throw error;
         console.log("data")
         console.log(data)

         var overlay = new google.maps.OverlayView();
         data = scatterFormatter(datasetDict.name, data)
         
         //exampleData = [{lat: 52.3791, lon:4.9003, key:"Amsterdam"}, {lat:52.3452, lon:4.9676, key:"Diemen"}]
          // Add the container when the overlay is added to the map.
          overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayLayer).append("div")
                .attr("class", "scatter");

            // Draw each marker as a separate SVG element.
            // We could use a single SVG, but what size would it have?
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

              // Add a label.
              marker.append("text")
                  .attr("x", padding + 7)
                  .attr("y", padding)
                  .attr("dy", ".31em")
                  .text(function(d) { return d.key; });

              function transform(d) {
                d = new google.maps.LatLng(d.lat, d.lon);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
              }
            };
          };
          // Bind our overlay to the map…
          overlay.setMap(map);
        },function(error, rows){
            console.log(rows);
            console.log(error); 
        });//*/
    //} else {
    //    document.getElementsByClassName("stations")[0].remove();
    //}

}

function drawLayers(layer){
    console.log("Layer ", layer)
    //remove div if it exists
    //add div
    
    scatterPlot(DATASETS["BRK"])
    //add everything
    
    //draw scatter layer last
}