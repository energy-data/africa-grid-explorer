'use strict';
import config from './config';

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);

mapboxgl.accessToken = config.mapboxToken;
var nav = mapboxgl.NavigationControl();

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
      theMap.addControl(new mapboxgl.NavigationControl(), 'top-left')
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
              [0, '#0288D1'],
              // MV
              [1, '#689F38'],
              // HV
              [66, '#F57C00'],
              // UHV
              [225, '#5D4037']
            ]
          },
          'line-width': {
            'stops': [
              [5,1],
              [10,2]
            ]
          },
          // 'line-width': {
          //   'property': 'status',
          //   'type': 'categorical',
          //   'stops': [
          //     ['Planned', 1],
          //     ['Existing', 3]
          //   ]
          // },
          // 'line-gap-width': {
          //   'property': 'status',
          //   'type': 'categorical',
          //   'stops': [
          //     ['Planned', 2]
          //   ]
          // },
          // 'line-blur': {
          //   'property': 'status',
          //   'type': 'categorical',
          //   'stops': [
          //     ['Planned', 1]
          //   ]
          // }
        }
      })
    })
  })
};


// Filter the map data by property
document.getElementById('filter').addEventListener('click',function(e) {
  if(e.target && e.target.className == 'status-filter') {
    var clickedOption = e.target.innerText;
    e.preventDefault();

    switch (clickedOption) {
      case 'All':
        map.setFilter('data', ['!=', 'status', 'Decommissioned']);
      case 'Planned':
        map.setFilter('data', ['in', 'status', 'Planned', 'Construction'])
      case 'Existing':
        map.setFilter('data', ['==', 'status', 'Existing'])
    }

    // Remove .active from all items 
    document.querySelectorAll('.status-filter').forEach(function(o) {o.classList.remove('active')})
    e.target.classList.add('active')
  }
});


// Open the modal
document.getElementById('modal-open').addEventListener('click',function(e) {
  e.preventDefault();
  let modal = document.getElementById('about-modal')
  modal.classList.remove('modal-leave', 'modal-leave-active')
  modal.classList.add('modal-enter', 'modal-enter-active')
});

// Close the modal when somebody clicks the Dismiss icon, or outside the modal
document.querySelectorAll('#about-modal, #modal-dismiss').forEach(function(o) { 
  o.addEventListener('click',function(e) {
    e.preventDefault();
    let modal = document.getElementById('about-modal')
    modal.classList.remove('modal-enter', 'modal-enter-active')
    modal.classList.add('modal-leave', 'modal-leave-active')
  })
})

// Don't close if somebody clicks on the model itself
document.getElementById('about-modal-inner').addEventListener('click', function(e) {
  e.stopPropagation();
});