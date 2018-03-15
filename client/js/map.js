function createMap() {  
  var mapProp= {
      center:new google.maps.LatLng(52.3702, 4.8952),
      zoom:11,
      disableDefaultUI: true,
      styles:[
        {
          "featureType": "landscape.man_made",
          "elementType": "all",
          "stylers": [
                {
                  "color": "#444444"
                },
                {
                    "saturation": "-100"
                }
            ]
        },
        {
          "featureType": "administrative.neighborhood",
          "elementType": "all",
          "stylers": [
                {
                    "saturation": "-100"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "65"
                },
                {
                    "visibility": "on"
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
                    "saturation": "-100"
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
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": "30"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": "40"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#ffff00"
                },
                {
                    "lightness": -25
                },
                {
                    "saturation": -97
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
      ],
  };
  map =new google.maps.Map(d3.select("#map").node(), mapProp);
  
  var polygonMask = new google.maps.Polygon({
  map:map,
  strokeColor: '#000000',
  strokeOpacity: 0.5,
  strokeWeight: 2,
  fillColor: '#CACACA',
  fillOpacity: 0.35,
  paths: [[new google.maps.LatLng(52.205432, 4.378356),
  new google.maps.LatLng(52.543880, 4.378356),
  new google.maps.LatLng(52.543880, 5.429566),
  new google.maps.LatLng(52.205432, 5.429566),
  new google.maps.LatLng(52.205432, 4.378356)],
  [new google.maps.LatLng(52.421010, 4.825784),
  new google.maps.LatLng(52.431064, 4.739208),
  new google.maps.LatLng(52.400711, 4.728759),
  new google.maps.LatLng(52.396663, 4.757818),
  new google.maps.LatLng(52.356150, 4.755684),
  new google.maps.LatLng(52.325557, 4.818426),
  new google.maps.LatLng(52.318248, 4.912376),
  new google.maps.LatLng(52.356102, 4.969595),
  new google.maps.LatLng(52.342246, 5.010136),
  new google.maps.LatLng(52.354576, 5.039057),
  new google.maps.LatLng(52.375401, 5.037680),
  new google.maps.LatLng(52.388654, 5.079162),
  new google.maps.LatLng(52.417239, 5.065413),
  new google.maps.LatLng(52.426762, 4.982636),
  new google.maps.LatLng(52.411608, 4.930716),
  new google.maps.LatLng(52.430672, 4.866691),
  new google.maps.LatLng(52.416662, 4.856078),
  new google.maps.LatLng(52.421010, 4.825784),
  new google.maps.LatLng(52.421010, 4.825784)],
  [new google.maps.LatLng(52.323819, 4.956098),
  new google.maps.LatLng(52.308532, 4.929328),
  new google.maps.LatLng(52.278174, 4.961054),
  new google.maps.LatLng(52.302457, 5.021543),
  new google.maps.LatLng(52.324512, 5.016134),
  new google.maps.LatLng(52.313979, 4.997860),
  new google.maps.LatLng(52.330565, 4.984476),
  new google.maps.LatLng(52.323819, 4.956098),
  new google.maps.LatLng(52.323819, 4.956098)]
  ]});
  
}