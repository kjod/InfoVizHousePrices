var EMPLOYMENTSWITCH = false;

//const DATASETS = {"funda": {name:"funda", dataset: "funda_data.json"}} 
const SCATTERPOINTID = "scatterPoint";


/**
Plots scatter onto google map
datasetDict: indlcued incase scatter is used for different data sets.
key: used to determine which value in dataset will be used for colouring.
*/
function scatterPlot(datasetDict, key) {
    var width = 960, height = 500;
    
    d3.json("funda_data.json", function(data) {
      data = filterHouseData(data)

      var arr = data.map(o => o[key]);
      let maxValue = Math.max(...arr)
      let minValue = Math.min(...arr)

      const colorScale = d3.scaleLinear()
        .domain([minValue, maxValue * .25 , (minValue + maxValue) * .75, maxValue])
        .range([ "yellow", "orange", "red", "maroon"]);

      legendFormatter(colorScale, key, "scatter", maxValue, minValue)

      var overlay = new google.maps.OverlayView();    
      overlay.onAdd = function() {
        //var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "stations");
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "targetCircles")
        //var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "scatterpoints")//change to only use id
        .attr("id", "scatterpoints");

        overlay.draw = function() {
          var projection = this.getProjection();
          var padding = 10; 


          var marker = layer.selectAll("svg")
              .attr("height", "10px")
              .attr("width", "10px")
              .data(d3.entries(data))
              .each(transform) // update existing markers
              .enter().append("svg")
              .each(transform)
              .style('fill', d => colorScale(d.value.house_price))
              .attr("class", "marker");

          // Add a circle.
          marker.append("circle")
              .attr("r", 4.5)
              .attr("cx", padding)
              .attr("cy", padding)
              .attr("class", "scatterCircle")
              .attr("id", o => SCATTERPOINTID + o.value.postcode)
              .on("mouseover", function(event,){
                                  let elem = document.getElementById(SCATTERPOINTID + event.value.postcode)
                                  let node = document.createElement("div");
                                  node.id = "tooltip" + SCATTERPOINTID + event.value.postcode
                                  node.className = "tooltip"                            /*This is stupid!*/
                                  node.innerHTML =  "<span class='scatterHeadingText'><b>"//&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 
                                                    + event.value.postcode + "</b></span>"+
                                                    "<table class='scatterTooltipTable'><tr><td>House Price:</td><td>"+ event.value.house_price.toFixed(2) +    
                                                    "</td></tr><tr><td>\
                                                    Avg Purchase Price:</td><td>" + event.value.purchase_price.toFixed(2) + "</td></tr></table>"
                                                    /*"<br>Avg Size: " + event.value.size +
                                                    "<br>Avg Area: " + event.value.area*/
                                  //node.style = elem.style
                                  node.style.top = (elem.parentElement.style.top.slice(0, -2) - 60) + "px"
                                  node.style.left = elem.parentElement.style.left
                                  node.style.backgroundColor = "white";
                                  node.style.border = "3px solid black";
                                  node.style.width = "175px";
                                  node.style.padding = "5px";
                                  node.style.borderRadius = "6px";
                                  node.style.position = "absolute";
                                  node.style.zIndex = "1000";
                                  elem.parentElement.parentElement.appendChild(node);
                                })
              .on("mouseout", function(event){
                                  document.getElementById("tooltip" + SCATTERPOINTID + event.value.postcode).remove()
              });

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

function drawScatter(layer){
   //remove div if it exists
    //add div
    if(layer === "house_price"){
      if(!houseProcesSwitch) { scatterPlot(DATASETS["funda"], layer) }
      else {  
        removeScatter()
      }
      houseProcesSwitch = !houseProcesSwitch;
    }

    //add everything
    
    //draw scatter layer last, doesn't matter
}

function removeScatter(){
  document.getElementById("scatter").remove();
  document.getElementById("scatterLegend").remove();
  document.getElementsByClassName("scatterpoints")[0].remove();
}