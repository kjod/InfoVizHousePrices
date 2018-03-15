var EMPLOYMENTSWITCH = false;

//Need filterSet??
//Might need to pus these into one file, if we wnat heat maps
function getEmploymentLayer() {
    EMPLOYMENTSWITCH = !EMPLOYMENTSWITCH;
    //console.log("d3 ", d3)
    // Load the station data. When the data comes back, create an overlay.
    //console.log(d3.csv("locations_and_people_employed.csv", function(data) {
      //console.log("Error ", error);
     //if (error) throw error;
    // return data;
    //}));
    
    if(EMPLOYMENTSWITCH){
        d3.csv("exampleData.csv", function(data) {
          //console.log("Error ", error);
         //if (error) throw error;
         
         var overlay = new google.maps.OverlayView();
         //exampleDataCSV = [{lat:52.3791, lon:4.9003, key:"Amsterdam"}, {lat:52.3452, lon:4.9676, key:"Diemen"}]
         //exampleData = {"AMSTERDAM":[52.3791,4.9003], "DIEMEN":[52.3452,4.9676]}
          // Add the container when the overlay is added to the map.
          //console.log(data);
          overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayLayer).append("div")
                .attr("class", "stations");

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

              // Add a label.
              marker.append("text")
                  .attr("x", padding + 7)
                  .attr("y", padding)
                  .attr("dy", ".31em")
                  //.text(function(d) { return d.key; });
                  .text(function(d) { return d.value.name; });

              function transform(d) {
                if(d.key != "columns"){
                  //d = new google.maps.LatLng(d.value[0], d.value[1]);
                  d = new google.maps.LatLng(d.value.lat, d.value.lon);
                  d = projection.fromLatLngToDivPixel(d);
                  return d3.select(this)
                      .style("left", (d.x - padding) + "px")
                      .style("top", (d.y - padding) + "px");
                }else{
                  return d3.select(this).remove();
                }
              }
            };
          };
          // Bind our overlay to the map…
          overlay.setMap(map);
        });//*/
    }else{
        document.getElementsByClassName("stations")[0].remove();
    }
}
//getEmploymentLayer();