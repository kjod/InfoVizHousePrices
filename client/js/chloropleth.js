const scaleLat = d3.scaleLinear()
				.domain([52.278176301670996,52.43106593201049])
				.range([height,0]);

const scaleLong = d3.scaleLinear()
				.domain([4.7287615953970095,5.079164906443845])
				.range([0,width]);


const scaleColor = d3.scaleLinear() //Scale for Population density
				.domain([10.0,28312.0])
				.range([0,255]);

const redBlueScaleColor = d3.scaleLinear()
	.domain([10.0,14156.0,28312.0])
	.range(["cornflowerblue", "white", "red"]);

const color = d3.scaleOrdinal(d3.schemeCategory20); //used for the random coloring

var POPDENSITYSWITCH = false;
var POPDEPTH = "";

function populationDensity(filename="districts"){
	POPDENSITYSWITCH = !POPDENSITYSWITCH;
	if(filename == "districts" && POPDEPTH == "neighbourhoods"){
		POPDEPTH = "districts"
		POPDENSITYSWITCH = true
	}else if(filename == "neighbourhoods" && POPDEPTH == "districts"){
		POPDEPTH = "neighbourhoods"
		POPDENSITYSWITCH = true
	}
	if(POPDENSITYSWITCH){
		POPDEPTH = filename
		d3.json("names_coordinates_data/"+filename+".json", function(shapes) {
			var overlay = new google.maps.OverlayView();
			var padding = 10;
			overlay.onAdd = function() {
				var areas = svg.selectAll("polygon")
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
					});
			}
		});
	}
}