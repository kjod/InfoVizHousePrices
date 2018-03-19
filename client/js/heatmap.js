var EMPLOYMENTSWITCH = false;
const HEATMAPPOINTID = "scatterPoint";
var heatmap = null;

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

      legendFormatter(colorScale, key, "heatmap", maxValue, minValue)

      var pointArray = new google.maps.MVCArray(data.map( o => { return { 
                                                                          location: new google.maps.LatLng(o.lat, o.lon), 
                                                                          weight: o[key]
                                                                        } 
                                                                }));
      console.log("about to create heat map, ", colorScale)
      heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        radius: 25,
        map: map,
        //gradient: colorScale
      });
      heatmap.setMap(pointArray);
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
        heatmap.setMap(null);
        document.getElementById("heatmap").remove(); 
        //document.getElementsByClassName("heatmappoints")[0].remove();
      }
      houseProcesSwitch = !houseProcesSwitch;
    }

    //add everything
    
    //draw scatter layer last, doesn't matter
}