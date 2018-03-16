function createMap() {
  var mapProp= {
      center:new google.maps.LatLng(52.3572, 4.8952),
      zoom:12,
      disableDefaultUI: true,
      styles:[
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
],
  };
  map =new google.maps.Map(d3.select("#map").node(),mapProp);

     var everythingElse = [
        new google.maps.LatLng(0, -90),
        new google.maps.LatLng(0, 90),
        new google.maps.LatLng(90, -90),
        new google.maps.LatLng(90, 90),
    ];

    d3.json("../html/names_coordinates_data/city.json", function(shapes) {
        paths = [everythingElse]
        shapes.Areas.forEach(function(d){
            paths.push(d.points.map(function(d){
                return {lat:d.x,lng:d.y}
            }));
        //https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
        })
        var polygon = new google.maps.Polygon({
            paths: paths,
            strokeColor: "#FF0000",
            strokeOpacity: 0.3,
            strokeWeight: 2,
            fillColor: "#CACACA",
            fillOpacity: 0.6
        });
        polygon.setMap(map)
    });

}