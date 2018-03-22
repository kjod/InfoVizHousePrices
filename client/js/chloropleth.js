//variable to save previous center and zooming state
var prev_center;
var prev_zoomLvl;

const scaleColor = d3.scaleLinear() //Scale for Population density
				.domain([10.0,28312.0])
				.range([0,255]);

const color = d3.scaleOrdinal(d3.schemeCategory20); //used for the random coloring
const preference_ids = ["greenselect", "childrenselect", "budgetselect", "seniorselect", "partyselect"];
const layers = {
	population_density: "Population_density_2016", 
	crime_rate: "Crime_index_2016", 
	energy: "energy_label_2016",
	/*ethinicities:{
		"Antillean_2016",
		"Moroccan_2016",
		"No_migration_background_2016",
		"Other_non_western_2016",
		"Surinamese_2016",
		"Turks_2016",
		"Western_2016"
		},*/
}
const filterSwitch = {population_density: false, crime_rate: false, energy:false } 
const fillOpacityDefault = 0.4;
const highlightedFillOpacityDefault = 0.7;
const datasets = {"districts": "names_coordinates_data/districts.json", 
				  "neighbourhoods": "names_coordinates_data/neighbourhoods.json"}//add to main

var redBlueScaleColor = d3.scaleLinear()//need to calculate scale dynamically
	.domain([0,14156.0,28312.0])
	.range(["cornflowerblue", "red"]);
var POPDENSITYSWITCH = false;
var polygons = [];
var mapData = [];
var maxValue = 0;
var minValue = 0;
var statsOn = false;

var currentField = ""//use as default

function changeZoomLevel(value){
	zoomLevel = value//(zoomLevel === "districts") ? "neighbourhoods" : "districts";
	if(currentField !== ""){
		removeChoroplethLayers()
		filterSwitch[currentField] = !filterSwitch[currentField]// want opposite effect
		drawChoropleth(currentField)
	}
}

function getData(field){
	d3.json(datasets[zoomLevel], function(shapes) {
		console.log(shapes)
		var arr = shapes.Areas.map(o => o[field]);
	    maxValue = Math.max(...arr);
	    minValue = Math.min(...arr.filter(value => value > 0));
	    redBlueScaleColor = d3.scaleLinear()//need to calculate scale dynamically
			.domain([minValue, maxValue])
			.range(["cornflowerblue", "red"]);
	    polygons = []
		tooltipContainer = document.getElementById('tooltipContainer');
		
		var polygonOpacity = fillOpacityDefault;
		if(field == "neutral"){
			polygonOpacity = 0.0;
		}
		shapes.Areas.forEach(function(d){
			var thisColor = "rgb(169,169,169)"; //gray when the value is empty
			if (field == "neutral"){
				thisColor = "gray";
			}else if (d[field] !== ""){
				thisColor = redBlueScaleColor(+d[field]);
				console.log(d[field])
				//thisColor = "rgb(0, 0, " + (Math.round(scaleColor(+d.Population_density_2016))) + ")";
				mapData.push([+d.surface_green_2016, +d.Households_with_children_2016, +d.WOZ_value_2016, 0, +d.horeca_2016]);
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
				fillOpacity: polygonOpacity
			});

			polygons.push(polygon);
			google.maps.event.addListener(polygon,"mouseover",function(){
				polygon.setOptions({fillOpacity: '0.9'});
			});
			google.maps.event.addListener(polygon,"mouseout",function(){
				polygon.setOptions({fillOpacity: polygonOpacity});
			});
			google.maps.event.addListener(polygon,"click",function(){
				initGraph(d.area_code, d.area_name);
				tooltipContainer.innerHTML = '<strong>' + d.area_name + '</strong><br>' + +d[field];
				tooltipContainer.style.opacity = 1;
				if(!statsOn){
					showStats();
					statsOn = true;
				}
				
				//first save the current zooming state
				prev_center = map.getCenter();
				prev_zoomLvl = map.getZoom();
				
				//zooming
				var bounds = new google.maps.LatLngBounds();
				
				for(var i = 0; i < d.points.length;i++) {
					bounds.extend(new google.maps.LatLng(d.points[i].x, d.points[i].y));
				}
				var center = bounds.getCenter();
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
			if (field != "neutral"){
				showInfoTooltip(polygon, d.area_name, +d[field], tooltipContainer);
			}else{
				showInfoTooltip(polygon, d.area_name, "", tooltipContainer);
			}
			//attachPolygonInfoWindow(polygon, infoWindowText(d.area_name, +d[field]));
		});
		console.log("mapData ", mapData)
		console.log("Polygon ", polygons)
		if (field != "neutral"){
			legendFormatter(redBlueScaleColor, field, "choropleth", maxValue, minValue);
		}
		updateAnswers(polygonOpacity);
	});
}

function neutralScreen(){
	getData("neutral");
}

function infoWindowText(areaName, information){
	return '<strong>' + areaName + '</strong><br>' + information;
}

function showInfoTooltip(polygon, areaName, information, tooltipContainer){
	google.maps.event.addListener(polygon, 'mouseover', function(e) {
		if(!statsOn){
			tooltipContainer.innerHTML = '<strong>' + areaName + '</strong><br>' + information;
			tooltipContainer.style.opacity = 1;
		}
	});
	google.maps.event.addListener(polygon, 'mouseout', function() {
		if(!statsOn) tooltipContainer.style.opacity = 0;
	});
}

// //based on: https://divideandconquer.se/2011/09/15/marker-and-polygon-tooltips-in-google-maps-v3/
// function attachPolygonInfoWindow(polygon, html)
// {
// 	polygon.infoWindow = new google.maps.InfoWindow({
// 		content:html,
// 	});
// 	// polygon.infoWindow = new InfoBubble({
// 	// 	content:html,
// 	// 	shadowStyle:0,
// 	// 	padding:0,
// 	// 	backgroundColor:'transparent',
// 	// 	borderRadius:5,
// 	// 	arrowSize:10,
// 	// 	borderWidth:1,
// 	// 	borderColor:'#2c2c2c',
// 	// 	disableAutoPan:true,
// 	// 	hideCloseButton:true,
// 	// 	arrowPosition:30,
// 	// 	backgroundClassName:'infoBubble',
// 	// 	tabClassName:'tabby',
// 	// 	arrowStyle:2,
// 	// 	maxHeight:50,
// 	// });
// 	google.maps.event.addListener(polygon, 'mouseover', function(e) {
// 		polygon.infoWindow.setPosition(e.latLng);
// 		setTimeout(function(){
// 		polygon.infoWindow.open(map);
// 		},10);
// 	});
// 	google.maps.event.addListener(polygon, 'mouseout', function() {
// 		setTimeout(function(){
// 		polygon.infoWindow.close();
// 		},20);
// 	});
// }

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
	areaData = mapData;
	//return false;
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


function updateAnswers(polygonOpacity){

	areaPolygons = polygons;
	if (previousValue==""){
		answeredQuestions++;
		document.getElementById('completedLine').style.width = (answeredQuestions/totalQuestions)*100+"%"
		previousValue = "meh";
	}

	const pref = applyAnswers();
	let i = 0;

	if(houseProcesSwitch){
		houseProcesSwitch = !houseProcesSwitch
		if(houseViz === "heatmap"){
			removeHeatMap()
			drawHeatMap("house_price");
		} else {
			removeScatter()
			drawScatter("house_price");
		}
	}

	areaPolygons.forEach(function(polygon){
		if(checkAnswers(pref, i)){
			polygon.setOptions({fillOpacity: polygonOpacity});
			google.maps.event.addListener(polygon,"mouseout",function(){
				polygon.setOptions({fillOpacity: polygonOpacity});
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


function switchLayers(layer){
	for(i in filterSwitch){
		if(i !== layer && i !== "house_price"){
			document.getElementById(i + "Switch").checked = false;
			filterSwitch[i] = false;//double check
		}
	}
}

function drawChoropleth(layer){
	//if(layer == "populationDensity"){
	removeChoroplethLayers()
	//console.log(layer)
	switchLayers(layer);
	if(!filterSwitch[layer]){
		currentField = layer;
		getData(layers[layer])
	}
	filterSwitch[layer] = !filterSwitch[layer]	
}


function removeChoroplethLayers(){
	polygons.forEach(function(polygon){
			polygon.setMap(null);
		});
	if(document.getElementById("choroplethLegend")){
		document.getElementById("choroplethLegend").remove();
		document.getElementById("choropleth").remove();
	}
	mapData = []
	//polygons = null
}

//doesn;t work don't know why
//var get_data = {"districts": function(){getDistricts}, "neighbourhoods": getNeighbourhoods}
