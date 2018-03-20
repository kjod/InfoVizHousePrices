function legendFormatter(colorScale, key, id, maxValue, minValue){	
	let divideValue = 8
  var color_domain = [];
  var ext_color_domain = [];
  var legend_labels = [];
  let sum = 0;
    
  ext_color_domain.push(minValue)
  legend_labels.push("<" + minValue)

  for(var i = 1; i < divideValue; i++){
    sum = maxValue/divideValue * i
    color_domain.push(sum)
    ext_color_domain.push(sum)
    legend_labels.push(sum + "+")
  }
 
  var scatterDiv = d3.select("#content")
    .append("div")
    .attr("id", id)

  let xWidth = 50
  var legend = scatterDiv
    .append("div")
      .attr("class", "legend")
      .attr("id", id + "Legend")
      .html("<div><b>"+ toTitleCase(key.replace("_", " ")) +"</b></div>")
    .append("svg:svg")
      .attr("width", xWidth * divideValue)
      .attr("height", 40)

  for (var i = 0; i < ext_color_domain.length; i++) {   
    legend.append("svg:rect").
      attr("x", i*xWidth).
      attr("y", 0).
      attr("height", 20).
      attr("width", xWidth).
      attr("fill", colorScale(ext_color_domain[i]));//color

    legend.append("text").
      attr("x", i*xWidth).
      attr("y", 30).
      attr("height", 20).
      attr("width", xWidth).
      text(legend_labels[i]);//color
  };
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}