const scaleColor = d3.scaleLinear() //Scale for Population density
				.domain([10.0,28312.0])
				.range([0,255]);

const redBlueScaleColor = d3.scaleLinear()
	.domain([10.0,14156.0,28312.0])
	.range(["cornflowerblue", "white", "red"]);

const color = d3.scaleOrdinal(d3.schemeCategory20); //used for the random coloring

var POPDENSITYSWITCH = false;
var POPDEPTH = "";
var ID_USED = ""
var districtPolygons = [];
var neighbourhoodsPolygons = [];
var maxValue = 0;
var minValue = 0;


function extractDistricts(field){
	d3.json("names_coordinates_data/districts.json", function(shapes) {
		//console.log(shapes)
		var arr = shapes.Areas.map(o => o.);
	    maxValue = Math.max(...arr)
	    minValue = Math.min(...arr)

		shapes.Areas.forEach(function(d){
			var thisColor = "rgb(169,169,169)"; //gray when the value is empty
			if (d[field] != ""){
				thisColor = redBlueScaleColor(+d[field])
				//thisColor = "rgb(0, 0, " + (Math.round(scaleColor(+d.Population_density_2016))) + ")";
			}
			//https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
			var polygon = new google.maps.Polygon({
				paths: d.points.map(function(d){
					return {lat:d.x,lng:d.y}
				}),
				strokeColor: thisColor,
				strokeOpacity: 1,
				strokeWeight: 2,
				fillColor: thisColor,
				fillOpacity: 0.7
			});
			districtPolygons.push(polygon);
		});
		/*var areas = svg.selectAll("polygon")
			.data(shapes.Areas)
			.enter().append("polygon")
			.attr("points",function(d) { 
				return d.points.map(function(d) {
					return [scaleLong(d.y),scaleLat(d.x)].join(","); 
				}).join(" ");
			})
			// .attr("stroke","white").attr("stroke-width",1) //stroke
			// .attr("fill",function(d,i){return color(i);}) //fillRandom
			.attr("fill", function(d,i) { // heatmap
				if (d.Population_density_2016 != ""){
					return redBlueScaleColor(+d.Population_density_2016)
					//return "rgb(0, 0, " + (Math.round(scaleColor(+d.Population_density_2016))) + ")";
				}else{
					return "rgb(169,169,169)"; //gray when the value is empty
				}
			});*/
	});
}

function extractNeighbourhood(field){
	d3.json("names_coordinates_data/neighbourhoods.json", function(shapes) {
		var arr = shapes.Areas.map(o => o[field]);
	    maxValue = Math.max(...arr)
	    minValue = Math.min(...arr)
		
		shapes.Areas.forEach(function(d){
			var thisColor = "rgb(169,169,169)"; //gray when the value is empty
			if (d.Population_density_2016 != ""){
				thisColor = redBlueScaleColor(+d[field])
				//thisColor = "rgb(0, 0, " + (Math.round(scaleColor(+d.Population_density_2016))) + ")";
			}
			//https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
			var polygon = new google.maps.Polygon({
				paths: d.points.map(function(d){
					return {lat:d.x,lng:d.y}
				}),
				strokeColor: thisColor,
				strokeOpacity: 1,
				strokeWeight: 2,
				fillColor: thisColor,
				fillOpacity: 0.7
			});
			neighbourhoodsPolygons.push(polygon);
		});
	});
}


//add year here
function drawChoropleth(layer, zoomLevel){
	if(layer === populationDensity){
		POPDENSITYSWITCH = !POPDENSITYSWITCH;
		choropleth("Population_density_2016",zoomLevel, [])
	} else {
		removeChoropleth
	}
}

/*filters for questions*/
function choropleth(field, zoomLevel, filters){
	legendFormatter(redBlueScaleColor, "Population Density", POPDEPTH, maxValue, minValue)
		if(filename=="districts"){
			districtPolygons.forEach(function(polygon){
				polygon.setMap(map);
			});
		}else if(filename == "neighbourhoods"){
			neighbourhoodsPolygons.forEach(function(polygon){
				polygon.setMap(map);
			});
}

function removeChoropleth(zoomLevel){
	if(zoomLevel == "neighbourhoods"){
		neighbourhoodsPolygons.forEach(function(polygon){
			polygon.setMap(null);
		});
	} else {
		
	}
}
function populationDensity(filename="districts"){
	
	if(filename == "districts" && POPDEPTH == "neighbourhoods"){
		POPDEPTH = "districts"
		ID_USED = "neighbourCheck"
		POPDENSITYSWITCH = true
		document.getElementById(ID_USED).checked = false;
		neighbourhoodsPolygons.forEach(function(polygon){
			polygon.setMap(null);
		});
	}else if(filename == "neighbourhoods" && POPDEPTH == "districts"){
		POPDEPTH = "neighbourhoods"
		POPDENSITYSWITCH = true
		ID_USED = "districtCheck"
		document.getElementById(ID_USED).checked = false;
			districtsPolygons.forEach(function(polygon){
			polygon.setMap(null);
		});
	}
	if(POPDENSITYSWITCH){
		POPDEPTH = filename
		
		legendFormatter(redBlueScaleColor, "Population Density", POPDEPTH, maxValue, minValue)
		if(filename=="districts"){
			districtPolygons.forEach(function(polygon){
				polygon.setMap(map);
			});
		}else if(filename == "neighbourhoods"){
			neighbourhoodsPolygons.forEach(function(polygon){
				polygon.setMap(map);
			});
		}
	}else{
		document.getElementById(POPDEPTH + "Legend").remove(); 
		if(filename=="districts"){
			districtPolygons.forEach(function(polygon){
				polygon.setMap(null);
			});
		}else if(filename == "neighbourhoods"){
			
			neighbourhoodsPolygons.forEach(function(polygon){
				polygon.setMap(null);
			});
		}
	}
}
