var heatmap = null;

function heatMap(datasetDict, key) {
    var width = 960, height = 500;
    d3.json("funda_data.json", function(data) {
      data = filterHouseData(data)

      var arr = data.map(o => o[key]);
      let maxValue = Math.max(...arr)
      let minValue = Math.min(...arr)

      const colorScale = d3.scaleLinear()
        .domain([minValue, minValue + 500000, (minValue + maxValue)/2, maxValue])
        .range([ "yellow", "orange", "red" ,"maroon"]);
  
      //For changing the gradient
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
      heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        radius: 25,
        map: map,
        //gradient: colorScale
      });
      heatmap.setMap(pointArray);
  });

}

function drawHeatMap(layer){
    if(layer === "house_price"){
      if(!houseProcesSwitch) { heatMap(DATASETS["funda"], layer) }
      else {  
        removeHeatMap()
        //document.getElementsByClassName("heatmappoints")[0].remove();
      }
      houseProcesSwitch = !houseProcesSwitch;
    }
}

function removeHeatMap(){
    heatmap.setMap(null);
    document.getElementById("heatmapLegend").remove();
    document.getElementById("heatmap").remove(); 
}