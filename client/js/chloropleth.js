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
var districtPolygons = [];
let districtData = [];
let neighbourhoodData = [];
var neighbourhoodsPolygons = [];

d3.json("names_coordinates_data/districts.json", function(shapes) {
	//console.log(shapes)
	shapes.Areas.forEach(function(d){
		var thisColor = "rgb(169,169,169)"; //gray when the value is empty
		if (d.Population_density_2016 != ""){
			thisColor = redBlueScaleColor(+d.Population_density_2016);
			districtData.push([+d.surface_green_2016, +d.Households_with_children_2016, +d.WOZ_value_2016, 0, +d.horeca_2016]);
			//thisColor = "rgb(0, 0, " + (Math.round(scaleColor(+d.Population_density_2016))) + ")";
		}
		//https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
		var polygon = new google.maps.Polygon({
			paths: d.points.map(function(d){
				return {lat:d.x,lng:d.y}
			}),
			strokeColor: '#FF0000',
			strokeOpacity: 0.3,
			strokeWeight: 1,
			fillColor: thisColor,
			fillOpacity: 0.3
		});
		districtPolygons.push(polygon);
		google.maps.event.addListener(polygon,"mouseover",function(){
			polygon.setOptions({fillOpacity: '0.9'});
		}); 
		google.maps.event.addListener(polygon,"mouseout",function(){
			polygon.setOptions({fillOpacity: '0.3'});
		});
		google.maps.event.addListener(polygon,"click",function(){
			showStats();
		});
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
			neighbourhoodData.push([+d.surface_green_2016, +d.Households_with_children_2016, +d.WOZ_value_2016, 0, +d.horeca_2016]);
		}
		//https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
		var polygon = new google.maps.Polygon({
			paths: d.points.map(function(d){
				return {lat:d.x,lng:d.y}
			}),
			strokeColor: '#FF0000',
			strokeOpacity: 0.3,
			strokeWeight: 1,
			fillColor: thisColor,
			fillOpacity: 0.3
		});
		neighbourhoodsPolygons.push(polygon);
		google.maps.event.addListener(polygon,"mouseover",function(){
			polygon.setOptions({fillOpacity: '0.9'});
		}); 
		google.maps.event.addListener(polygon,"mouseout",function(){
			polygon.setOptions({fillOpacity: '0.3'});
		});
		google.maps.event.addListener(polygon,"click",function(){
			showStats();
		});
	});
});

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

var totalQuestions = document.getElementById('questions').getElementsByTagName('section').length;
var answeredQuestions = 0;
var previousValue = "meh";
function checkValue(thisShit){
	previousValue = thisShit.value;
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
			polygon.setMap(map);
		}else{
			polygon.setMap(null);
		}
		i++;
	});
}

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
		POPDEPTH = "neighbourhoods";
		POPDENSITYSWITCH = true;
		document.getElementById("districtCheck").checked = false;
		districtPolygons.forEach(function(polygon){
			polygon.setMap(null);
		});
	}
	if(POPDENSITYSWITCH){
		POPDEPTH = filename
		updateAnswers()
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