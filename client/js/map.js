function createMap() {
  var mapProp= {
      center:new google.maps.LatLng(52.3572, 4.8952),
      zoom:10,
      minZoom: 11, 
      maxZoom: 15,
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
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
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

  /*var allowedBounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(52.6524951,3.3141739), 
     new google.maps.LatLng(51.9500023,7.4840132),
     new google.maps.LatLng(51.5598461,4.6242574),
     new google.maps.LatLng(53.2559903,4.8582934)
  );*/



  map =new google.maps.Map(d3.select("#map").node(),mapProp);

     var everythingElse = [
        new google.maps.LatLng(0, -90),
        new google.maps.LatLng(0, 90),
        new google.maps.LatLng(90, -90),
        new google.maps.LatLng(90, 90),
    ];

  /*google.maps.event.addListener(map, 'dragend', function() {
     if (allowedBounds.contains(map.getCenter())) return;

     // Out of bounds - Move the map back within the bounds

     var c = map.getCenter(),
         x = c.lng(),
         y = c.lat(),
         maxX = allowedBounds.getNorthEast().lng(),
         maxY = allowedBounds.getNorthEast().lat(),
         minX = allowedBounds.getSouthWest().lng(),
         minY = allowedBounds.getSouthWest().lat();

     if (x < minX) x = minX;
     if (x > maxX) x = maxX;
     if (y < minY) y = minY;
     if (y > maxY) y = maxY;

     map.setCenter(new google.maps.LatLng(y, x));
   });*/

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