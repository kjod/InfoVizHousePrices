const scaleColor = d3.scaleLinear() //Scale for Population density
				.domain([10.0,28312.0])
				.range([0,255]);

const redBlueScaleColor = d3.scaleLinear()
	.domain([10.0,28312.0])
	.range(["cornflowerblue", "red"]);

const color = d3.scaleOrdinal(d3.schemeCategory20); //used for the random coloring

var POPDENSITYSWITCH = false;
var POPDEPTH = "";
var districtPolygons = [];
var neighbourhoodsPolygons = [];

d3.json("names_coordinates_data/districts.json", function(shapes) {
	//console.log(shapes)
	shapes.Areas.forEach(function(d){
		var thisColor = "rgb(169,169,169)"; //gray when the value is empty
		if (d.Population_density_2016 != ""){
			thisColor = redBlueScaleColor(+d.Population_density_2016)
			//thisColor = "rgb(0, 0, " + (Math.round(scaleColor(+d.Population_density_2016))) + ")";
		}
		//https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
		var polygon = new google.maps.Polygon({
			paths: d.points.map(function(d){
				return {lat:d.x,lng:d.y}
			}),
			strokeColor: '#FF0000',
			strokeOpacity: 1,
			strokeWeight: 1,
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

d3.json("names_coordinates_data/neighbourhoods.json", function(shapes) {
	console.log(shapes)
	shapes.Areas.forEach(function(d){
		var thisColor = "rgb(169,169,169)"; //gray when the value is empty
		if (d.Population_density_2016 != ""){
			thisColor = redBlueScaleColor(+d.Population_density_2016)
			//thisColor = "rgb(0, 0, " + (Math.round(scaleColor(+d.Population_density_2016))) + ")";
		}
		//https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
		var polygon = new google.maps.Polygon({
			paths: d.points.map(function(d){
				return {lat:d.x,lng:d.y}
			}),
			strokeColor: '#FF0000',
			strokeOpacity: 1,
			strokeWeight: 0.5,
			fillColor: thisColor,
			fillOpacity: 0.7
		});
		neighbourhoodsPolygons.push(polygon);
	});
});



function populationDensity(filename="districts"){
	POPDENSITYSWITCH = !POPDENSITYSWITCH;
	if(filename == "districts" && POPDEPTH == "neighbourhoods"){
		POPDEPTH = "districts"
		POPDENSITYSWITCH = true
		document.getElementById("neighbourCheck").checked = false;
		neighbourhoodsPolygons.forEach(function(polygon){
			polygon.setMap(null);
		});
	}else if(filename == "neighbourhoods" && POPDEPTH == "districts"){
		POPDEPTH = "neighbourhoods"
		POPDENSITYSWITCH = true
		document.getElementById("districtCheck").checked = false;
		districtPolygons.forEach(function(polygon){
			polygon.setMap(null);
		});
	}
	if(POPDENSITYSWITCH){
		POPDEPTH = filename
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
