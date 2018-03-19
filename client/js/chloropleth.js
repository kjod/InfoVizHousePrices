const scaleColor = d3.scaleLinear() //Scale for Population density
				.domain([10.0,28312.0])
				.range([0,255]);

const redBlueScaleColor = d3.scaleLinear()
	.domain([10.0,28312.0])
	.range(["cornflowerblue", "red"]);

const color = d3.scaleOrdinal(d3.schemeCategory20); //used for the random coloring

const preference_ids = ["greenselect", "childrenselect", "budgetselect", "seniorselect", "partyselect"];

var POPDENSITYSWITCH = false;
var POPDEPTH = "";
var ID_USED = ""
var districtPolygons = [];
var neighbourhoodsPolygons = [];
let districtData = [];
let neighbourhoodData = [];
var maxValue = 0;
var minValue = 0;
let fillOpacityDefault = 0.5;
let highlightedFillOpacityDefault = 0.7;

d3.json("names_coordinates_data/districts.json", function(shapes) {
	//console.log(shapes)
	var arr = shapes.Areas.map(o => o.Population_density_2016);
    maxValue = Math.max(...arr)
    minValue = Math.min(...arr)

	shapes.Areas.forEach(function(d){
		var thisColor = "rgb(169,169,169)"; //gray when the value is empty
		if (d.Population_density_2016 != ""){
			thisColor = redBlueScaleColor(+d.Population_density_2016);
			//thisColor = "rgb(0, 0, " + (Math.round(scaleColor(+d.Population_density_2016))) + ")";
			districtData.push([+d.surface_green_2016, +d.Households_with_children_2016, +d.WOZ_value_2016, 0, +d.horeca_2016]);
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
			fillOpacity: fillOpacityDefault
		});
		districtPolygons.push(polygon);
		google.maps.event.addListener(polygon,"mouseover",function(){
			polygon.setOptions({fillOpacity: '0.9'});
		});
		google.maps.event.addListener(polygon,"mouseout",function(){
			polygon.setOptions({fillOpacity: fillOpacityDefault});
		});
		google.maps.event.addListener(polygon,"click",function(){
			initGraph(d.area_code, d.area_name);
			//showStats();
			
			//zooming
			var bounds = new google.maps.LatLngBounds();
			for(var i = 0; i < d.points.length;i++) {
				bounds.extend(new google.maps.LatLng(d.points[i].x, d.points[i].y));
			}
			var center = bounds.getCenter();
			
			//console.log(bounds.toSpan().lat());
			console.log(bounds.toSpan().toString());
			var areaSpanLat = bounds.toSpan().lat();
			
			var zoomLevel;
			if(areaSpanLat > 0.02) {
				zoomLevel = 13;
			} else {
				zoomLevel = 14;
			}
			
			//console.log(center.toString());
			map.setZoom(zoomLevel);
			map.panTo(center);

		});
		attachPolygonInfoWindow(polygon, infoWindowText(d.area_name, +d.Population_density_2016));
	});
});

d3.json("names_coordinates_data/neighbourhoods.json", function(shapes) {
	var arr = shapes.Areas.map(o => o.Population_density_2016);
    maxValue = Math.max(...arr)
    minValue = Math.min(...arr)
	
	shapes.Areas.forEach(function(d){
		var thisColor = "rgb(169,169,169)"; //gray when the value is empty
		if (d.Population_density_2016 != ""){
			thisColor = redBlueScaleColor(+d.Population_density_2016)
			//thisColor = "rgb(0, 0, " + (Math.round(scaleColor(+d.Population_density_2016))) + ")";
			neighbourhoodData.push([+d.surface_green_2016, +d.Households_with_children_2016, +d.WOZ_value_2016, 0, +d.horeca_2016]);
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
			fillOpacity: fillOpacityDefault
		});
		neighbourhoodsPolygons.push(polygon);
		google.maps.event.addListener(polygon,"mouseover",function(){
			polygon.setOptions({fillOpacity: '0.9'});
		}); 
		google.maps.event.addListener(polygon,"mouseout",function(){
			polygon.setOptions({fillOpacity: fillOpacityDefault});
		});
		google.maps.event.addListener(polygon,"click",function(){
			initGraph(d.area_code, d.area_name);
			showStats();
		});
		attachPolygonInfoWindow(polygon, infoWindowText(d.area_name, +d.Population_density_2016));
	});
});


function infoWindowText(areaName, information){
	return '<strong>' + areaName + '</strong><br />' + information;
}

//based on: https://divideandconquer.se/2011/09/15/marker-and-polygon-tooltips-in-google-maps-v3/
function attachPolygonInfoWindow(polygon, html)
{
	polygon.infoWindow = new google.maps.InfoWindow({
		content: html,
	});
	google.maps.event.addListener(polygon, 'mouseover', function(e) {
		polygon.infoWindow.setPosition(e.latLng);
		polygon.infoWindow.open(map);
	});
	google.maps.event.addListener(polygon, 'mouseout', function() {
		polygon.infoWindow.close();
	});
}

function applyAnswers(){
	let preferences = [0, 0, 0, 0, 0];
	let i = 0;
	preference_ids.forEach(function(d){
		let e = document.getElementById(d);	
		preferences[i] = e.options[e.selectedIndex].value;
		i++;
	})
	return preferences;
}
 
function checkAnswers(preferences, i){
	if (POPDEPTH == "districts"){
		areaData = districtData;
	}else if (POPDEPTH == "neighbourhoods"){
		areaData = neighbourhoodData;
	}else{
		return false;
	}
	//THESE SHOULD BE CHANGED WHEN THE QUESTIONS/ANSWERS ARE CHANGED!!
	if ((areaData[i] == null) ||
		((areaData[i][0] >= ((preferences[0] - 1) * 33.3)) || (preferences[0] === "1") || (preferences[0] === "")) && //green
		(((areaData[i][1] >= 20.0) && (preferences[1] == "y")) || (preferences[1] == "n") || (preferences[1] === "")) && //children
		((areaData[i][2] >= ((preferences[2] - 1) * 100000)) || (preferences[2] === "1") || (preferences[2] === "")) && //budget
		// ((areaData[i][3] >= ((preferences[3] - 1) * 33.3)) || (preferences[3] === "1") || (preferences[3] === "")) && //senior, doesn't work, no data
		((areaData[i][4] >= ((preferences[4] - 1) * 5000.0)) || (preferences[4] === "1") || (preferences[4] === ""))){ //party
		return true;
	}else{
		return false;
	}
}

function updateAnswers(){
	if (previousValue==""){
		answeredQuestions++;
		document.getElementById('completedLine').style.width = (answeredQuestions/totalQuestions)*100+"%"
		previousValue = "meh";
	}
	if (POPDENSITYSWITCH && POPDEPTH == "districts"){
		areaPolygons = districtPolygons;
	}else if (POPDENSITYSWITCH && POPDEPTH == "neighbourhoods"){
		areaPolygons = neighbourhoodsPolygons;
	}else{
		return false;
	}
	const pref = applyAnswers();
	let i = 0;
	areaPolygons.forEach(function(polygon){
		if(checkAnswers(pref, i)){
			polygon.setOptions({fillOpacity: highlightedFillOpacityDefault});
			google.maps.event.addListener(polygon,"mouseout",function(){
				polygon.setOptions({fillOpacity: highlightedFillOpacityDefault});
			});
		}else{
			polygon.setOptions({fillOpacity: fillOpacityDefault});
			google.maps.event.addListener(polygon,"mouseout",function(){
				polygon.setOptions({fillOpacity: fillOpacityDefault});
			});
		}
		polygon.setMap(map);
		i++;
	});
}



function populationDensity(filename="districts"){
	POPDENSITYSWITCH = !POPDENSITYSWITCH;
	if(filename == "districts" && POPDEPTH == "neighbourhoods"){
		ID_USED = "neighbourCheck";
		document.getElementById(ID_USED).checked = false;
		document.getElementById(POPDEPTH + "Legend").remove(); 
		neighbourhoodsPolygons.forEach(function(polygon){
			polygon.setMap(null);
		});
		POPDEPTH = "districts";
		POPDENSITYSWITCH = true;
	}else if(filename == "neighbourhoods" && POPDEPTH == "districts"){
		ID_USED = "districtCheck";
		document.getElementById(ID_USED).checked = false;
		document.getElementById(POPDEPTH + "Legend").remove(); 
		districtPolygons.forEach(function(polygon){
			polygon.setMap(null);
		});
		POPDEPTH = "neighbourhoods";
		POPDENSITYSWITCH = true;
	}
	if(POPDENSITYSWITCH){
		POPDEPTH = filename;
		legendFormatter(redBlueScaleColor, "Population Density", POPDEPTH, maxValue, minValue);
		updateAnswers();
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
		POPDEPTH = "";
	}
}
