const scaleColor = d3.scaleLinear() //Scale for Population density
				.domain([10.0,28312.0])
				.range([0,255]);
const redBlueScaleColor = d3.scaleLinear()
	.domain([10.0,14156.0,28312.0])
	.range(["cornflowerblue", "white", "red"]);
const color = d3.scaleOrdinal(d3.schemeCategory20); //used for the random coloring
const preference_ids = ["greenselect", "childrenselect", "budgetselect", "seniorselect", "partyselect"];
const layers = {population_density: "Population_density_2016"}
const filterSwitch = {populationDensity: false} 
var POPDENSITYSWITCH = false;
var POPDEPTH = "";
var ID_USED = ""
var polygons = [];
var mapData = [];
var maxValue = 0;
var minValue = 0;
var currentField = ""

function switchDistricts(){
	zoomLevel = (zoomLevel === "districts") ? "neighbourhoods" : "districts";
	//remove old layers and legend 
	get_data[zoomLevel](currentField)
}


function getDistricts(field){
	d3.json("names_coordinates_data/districts.json", function(shapes) {
		//console.log(shapes)
		var arr = shapes.Areas.map(o => o[field]);
	    maxValue = Math.max(...arr)
	    minValue = Math.min(...arr)

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
		legendFormatter(redBlueScaleColor, currentField, maxValue, minValue);
		updateAnswers();
	});
}


function getNeighbourhoods(field){
	d3.json("names_coordinates_data/neighbourhoods.json", function(shapes) {
		var arr = shapes.Areas.map(o => o[field]);
	    maxValue = Math.max(...arr)
	    minValue = Math.min(...arr)
		
		shapes.Areas.forEach(function(d){
			var thisColor = "rgb(169,169,169)"; //gray when the value is empty
			if (d[field] != ""){
				thisColor = redBlueScaleColor(+d[field])
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
				fillOpacity: 0.7
			});
			neighbourhoodsPolygons.push(polygon);
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
		legendFormatter(redBlueScaleColor, currentField, maxValue, minValue);
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


function drawChoropleth(layer){
	//if(layer == "populationDensity"){
	console.log(layer)
	if(!filterSwitch[layer]){
		console.log("In");
		currentField = layer;
		console.log(zoomLevel)
		//f = zoomLevel === "districts" ? getDistricts : getNeighbourhoods; //get_data[zoomLevel](); doesn't work?  
		if(zoomLevel === "districts"){
			//firstFunction(() => console.log('huzzah, I\'m done!'))
			getDistricts(layers[layer])
			/*.then(function(){ then doesn't work
				console.log(layer)
				legendFormatter(redBlueScaleColor, layer, maxValue, minValue);
				updateAnswers();
				/*indlcude year here*/
			//});//add error
		} else {
			getNeighbourhoods(layers[layer]).then(function(){
				//console.log(layer)
				//legendFormatter(redBlueScaleColor, layer, maxValue, minValue);
				/*indlcude year here*/
				//updateAnswers();
			});//add error
		}
	} else {
		polygons.forEach(function(polygon){
			polygon.setMap(null);
		});
		document.getElementById(layer + "Legend").remove(); 
	}
	filterSwitch[layer] = !filterSwitch[layer]
	//document.getElementById(ID_USED).checked = false;
}

//doesn;t work don't know why
//var get_data = {"districts": function(){getDistricts}, "neighbourhoods": getNeighbourhoods}