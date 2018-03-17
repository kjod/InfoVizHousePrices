var EMPLOYMENTSWITCH = false;

const DATASETS = {"funda": {name:"funda", dataset: "funda_data.json"}} 

const colorScale = d3.scaleLinear()
  .domain([200000,2000000])
  .range(["yellow", "green"]);

var color_domain = [500000, 1000000, 1500000, 2000000]
var ext_color_domain = [0, 500000, 1000000, 1500000, 2000000]
var legend_labels = ["0", "< 500000", "500000+", "1500000+", "2000000+"]    

//Need filterSet??
function scatterPlot(datasetDict) {
    var width = 960, height = 500;

    var scatterDiv = d3.select("#content")
      .append("div")
      .attr("class", "scatter")

    var legend = scatterDiv
      .append("div")
        .attr("class", "scatterLegend")
        .html("<div><b>House Prices</b></div>")
      .append("svg:svg")
        .attr("width", 250)
        .attr("height", 40)

    for (var i = 0; i < ext_color_domain.length; i++) {   
      legend.append("svg:rect").
        attr("x", i*50).
        attr("y", 0).
        attr("height", 20).
        attr("width", 50).
        attr("fill", colorScale(ext_color_domain[i]));//color

      legend.append("text").
        attr("x", i*50).
        attr("y", 30).
        attr("height", 20).
        attr("width", 50).
        text(legend_labels[i]);//color
    };

    d3.json("funda_data.json", function(data) {
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
    if(layer === "house_prices"){
      if(!houseProcesSwitch) { scatterPlot(DATASETS["funda"]) }
      else {  
        document.getElementsByClassName("scatter")[0].remove(); 
        document.getElementsByClassName("scatterpoints")[0].remove();
      }
      houseProcesSwitch = !houseProcesSwitch;
    }

     dd everything
    
    //draw scatter layer last, doesn't matter
}