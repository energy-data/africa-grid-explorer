'use strict';
import config from './config';

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);

mapboxgl.accessToken = config.mapboxToken;

if (!mapboxgl.supported()) {
  document.getElementById('map').innerHTML = 'Your browser does not support Mapbox GL';
} else {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [60, 2.867],
    zoom: 1.5
  })
  attachDataToMap(map, config.dataLayer)
}

function attachDataToMap(theMap, tilejson) {
  theMap.on('load', function () {
    fetch(tilejson)
    .then(function (response) {
      return response.json()
    }).then(function (tilejson) {
      var layer = tilejson;
      layer.type = 'vector'
      theMap.addSource('data', layer)
      theMap.fitBounds([[layer.bounds[0], layer.bounds[1]], [layer.bounds[2], layer.bounds[3]]], {padding: 20})
      theMap.addLayer({
        'id': 'data',
        'type': 'line',
        'source': 'data',
        'source-layer': 'data_layer',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': {
            'property': 'voltage_kV',
            'type': 'interval',
            'stops': [
              // LV
              [0, 'blue'],
              // MV
              [1, 'green'],
              // HV
              [66, 'red'],
              // UHV
              [225, 'black']
            ]
          },
          'line-width': 1
        }
      })
      theMap.addControl(nav, 'top-left');
    })
  })
};

document.getElementById('filter').addEventListener('click',function(e) {
  if(e.target && e.target.className == 'status-filter') {
    var clickedOption = e.target.innerText;
    e.preventDefault();

    if (clickedOption === 'All') {
      map.setFilter('data', ['has', 'status']);
    } else {
      map.setFilter('data', ['==', 'status', clickedOption]);
    }

    // Remove .active from all items 
    document.querySelectorAll('.status-filter').forEach(function(o) {o.classList.remove('active')})
    e.target.classList.add('active')
  }
});