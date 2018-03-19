var EMPLOYMENTSWITCH = false;
const HEATMAPPOINTID = "scatterPoint";


/**
Plots scatter onto google map
datasetDict: indlcued incase scatter is used for different data sets.
key: used to determine which value in dataset will be used for colouring.
*/
function heatMap(datasetDict, key) {
    var width = 960, height = 500;
    d3.json("funda_data.json", function(data) {
      
      var arr = data.map(o => o[key]);
      let maxValue = Math.max(...arr)
      let minValue = Math.min(...arr)

      const colorScale = d3.scaleLinear()
        .domain([minValue, minValue + 500000, (minValue + maxValue)/2, maxValue])
        .range([ "yellow", "orange", "red" ,"maroon"]);
      /*for(let i = 0 ; i < data; i++){

      }*/
      var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
      ]

      legendFormatter(colorScale, key, "scatter", maxValue, minValue)

      var pointArray = new google.maps.MVCArray(data.map( o => { return { 
                                                                          location: new google.maps.LatLng(o.lat, o.lon), 
                                                                          weight: o[key]
                                                                        } 
                                                                }));
      console.log("about to create heat map, ", colorScale)
      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        radius: 25,
        map: map,
        //gradient: colorScale
      });
      console.log("created HeatMap")
      heatmap.setMap(pointArray);
      console.log("HeatMap")
      /*var overlay = new google.maps.OverlayView();    
      overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "targetCircles")
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
                                  /*node.innerHTML =  "<span class='scatterHeadingText'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<b>" 
                                                    + event.value.postcode + "</b><span>"+
                                                    "<span><br> House Price: "+ event.value.house_price.toFixed(2) + 
                                                    "<br>Avg Purchase Price: " + event.value.purchase_price.toFixed(2) + "</span>"
                                                    /*"<br>Avg Size: " + event.value.size +
                                                    "<br>Avg Area: " + event.value.area*/
                                  //node.style = elem.style
                                  /*node.style.top = (elem.parentElement.style.top.slice(0, -2) - 60) + "px"
                                  node.style.left = elem.parentElement.style.left
                                  node.style.backgroundColor = "black"
                                  node.style.borderBottom = "1px dotted black";
                                  node.style.width = "200px";
                                  node.style.color = "#fff";
                                  node.style.padding = "5px 0";
                                  node.style.borderRadius = "6px";
                                  node.style.position = "absolute";
                                  node.style.zIndex = "1000";
                                  elem.parentElement.parentElement.appendChild(node);
                                })
              /*.on("mousemove", function(event){
                                  //console.log("Hover ", event)
                                  //console.log(event)
                                  //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
              })*/
              /*.on("mouseout", function(event){
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
      overlay.setMap(map);*/
  });

}

var houseProcesSwitch = false;

function drawHeatMap(layer){
    console.log("Layer ", layer)
    //remove div if it exists
    //add div
    if(layer === "house_price"){
      if(!houseProcesSwitch) { heatMap(DATASETS["funda"], layer) }
      else {  
        document.getElementById("heatmap").remove(); 
        document.getElementsByClassName("heatmappoints")[0].remove();
      }
      houseProcesSwitch = !houseProcesSwitch;
    }

    //add everything
    
    //draw scatter layer last, doesn't matter
}