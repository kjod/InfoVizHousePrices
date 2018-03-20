const scaleColor = d3.scaleLinear() //Scale for Population density
				.domain([10.0,28312.0])
				.range([0,255]);
const color = d3.scaleOrdinal(d3.schemeCategory20); //used for the random coloring

const preference_ids = ["greenselect", "childrenselect", "budgetselect", "seniorselect", "partyselect"];
const layers = {population_density: "Population_density_2016", crime_rate: "Crime_index_2016", energy: "energy_label_2016"}
const filterSwitch = {population_density: false, crime_rate: false, energy:false} 

var redBlueScaleColor = d3.scaleLinear()//need to calculate scale dynamically
	.domain([0,14156.0,28312.0])
	.range(["cornflowerblue", "white", "red"]);
var POPDENSITYSWITCH = false;
var POPDEPTH = "";
var ID_USED = ""
var polygons = [];
var mapData = [];
var maxValue = 0;
var minValue = 0;
var currentField = ""//use as default

function changeZoomLevel(value){
	zoomLevel = value//(zoomLevel === "districts") ? "neighbourhoods" : "districts";
	if(currentField !== ""){
		//if(filterSwitch[currentField]){removeChoroplethLayers()};
		removeChoroplethLayers()
		filterSwitch[currentField] = !filterSwitch[currentField]// want opposite effect
		drawChoropleth(currentField)
	}
	//remove old layers and legend 
	//get_data[zoomLevel](currentField)
}


function getDistricts(field){
	d3.json("names_coordinates_data/districts.json", function(shapes) {
		var arr = shapes.Areas.map(o => o[field]);
	    maxValue = Math.max(...arr)
	    minValue = Math.min(...arr)
	    polygons = []
	    redBlueScaleColor = d3.scaleLinear()//need to calculate scale dynamically
			.domain([minValue,(minValue + maxValue)/2,maxValue])
			.range(["cornflowerblue", "white", "red"]);
	    
		shapes.Areas.forEach(function(d){
			var thisColor = "rgb(169,169,169)"; //gray when the value is empty
			if (d[field] != ""){
				thisColor = redBlueScaleColor(+d[field]);
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
				fillOpacity: 0.7
			});
			polygons.push(polygon);
			google.maps.event.addListener(polygon,"mouseover",function(){
				polygon.setOptions({fillOpacity: '0.9'});
			}); 
			google.maps.event.addListener(polygon,"mouseout",function(){
				polygon.setOptions({fillOpacity: '0.3'});
			});
			google.maps.event.addListener(polygon,"click",function(event){
				showStats();
			});
		});

		legendFormatter(redBlueScaleColor, field, "choropleth", maxValue, minValue);
		updateAnswers();
	});
}


function getNeighbourhoods(field){
	d3.json("names_coordinates_data/neighbourhoods.json", function(shapes) {
		var arr = shapes.Areas.map(o => o[field]);
	    maxValue = Math.max(...arr)
	    minValue = Math.min(...arr)
	    redBlueScaleColor = d3.scaleLinear()//need to calculate scale dynamically
			.domain([minValue,(minValue + maxValue)/2,maxValue])
			.range(["cornflowerblue", "white", "red"]);
	    polygons = []

		shapes.Areas.forEach(function(d){
			var thisColor = "rgb(169,169,169)"; //gray when the value is empty
			if (d[field] != ""){
				thisColor = redBlueScaleColor(+d[field])
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
				fillOpacity: 0.7
			});
			polygons.push(polygon);
			google.maps.event.addListener(polygon,"mouseover",function(){
				polygon.setOptions({fillOpacity: '0.9'});
			}); 
			google.maps.event.addListener(polygon,"mouseout",function(){
				polygon.setOptions({fillOpacity: '0.3'});
			});
			google.maps.event.addListener(polygon,"click",function(event){
				showStats();
			});
		});
		legendFormatter(redBlueScaleColor, field, "choropleth", maxValue, minValue);
		updateAnswers();
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
	areaData = mapData;
	//return false;
	//THESE SHOULD BE CHANGED WHEN THE QUESTIONS/ANSWERS ARE CHANGED!!
	if ((areaData[i] == null) ||
		((areaData[i][0] >= ((preferences[0] - 1) * 33.3)) || (preferences[0] === "1")) && //green
		(((areaData[i][1] >= 20.0) && (preferences[1] == "y")) || (preferences[1] == "n")) && //children
		((areaData[i][2] >= ((preferences[2] - 1) * 100000)) || (preferences[2] === "1")) && //budget
		// ((areaData[i][3] >= ((preferences[3] - 1) * 33.3)) || (preferences[3] === "1")) && //senior, doesn't work, no data
		((areaData[i][4] >= ((preferences[4] - 1) * 5000.0)) || (preferences[4] === "1"))){ //party
		return true;
	}else{
		return false;
	}
}


function updateAnswers(){
	areaPolygons = polygons;
	const pref = applyAnswers();
	let i = 0;
	areaPolygons.forEach(function(polygon){
		if(checkAnswers(pref, i)){
			polygon.setMap(map);
		}else{
			polygon.setMap(null);
		}
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
		//f = zoomLevel === "districts" ? getDistricts : getNeighbourhoods; //get_data[zoomLevel](); doesn't work?  
		if(zoomLevel === "districts"){
			//firstFunction(() => console.log('huzzah, I\'m done!'))
			getDistricts(layers[layer])//implment call back here
		} else {
			getNeighbourhoods(layers[layer])
		}
	}
	filterSwitch[layer] = !filterSwitch[layer]	
	//document.getElementById(ID_USED).checked = false;
}

function removeChoroplethLayers(){
	polygons.forEach(function(polygon){
			polygon.setMap(null);
		});
	if(document.getElementById("choroplethLegend")){
		document.getElementById("choroplethLegend").remove();
	}
	mapData = []
	//polygons = null
}

//doesn;t work don't know why
//var get_data = {"districts": function(){getDistricts}, "neighbourhoods": getNeighbourhoods}