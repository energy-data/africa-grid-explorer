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
  attachDataToMap(map, config.energydataDataset)
}

function attachDataToMap(theMap, dataset) {
  theMap.on('load', function () {
    // get the dataset JSON
    fetch(`https://energydata.info/api/3/action/package_show?id=${dataset}`)
    .then(function (response) {
      return response.json()
    }).then(function (datasetJSON) {
      // The tilejson is assumed to be on the first resource of the dataset
      return datasetJSON.result.resources[0].tilejson
    }).then(function (tilejson) {
      // Fetch the tilejson
      return fetch(tilejson)
    }).then(function(response) {
      return response.json()
    }).then(function (tilejson) {
      var layer = tilejson;
      layer.type = 'vector'
      layer.attribution = '<a href="http://energydata.info">energydata.info</a>'
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
              // a 0 value is missing data, and is likely to be Medium Voltage (66+) 
              [0, '#002f54'],
              // LV & MV
              [0.001, '#22a6f5'],
              // HV
              [66, '#002f54'],
            ]
          },
          'line-width': {
            'stops': [
              [0,1],
              [5,2],
              [10,3],
              [15,5]
            ]
          },
          'line-opacity': {
            'property': 'status',
            'type': 'categorical',
            'stops': [
              ['Planned', 0.7],
              ['Construction', 0.7]
            ]
          }
        }
      })

      // When a click event occurs near a feature, open a popup.
      theMap.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['data'] });
        if (!features.length) {
          return;
        }
        var feature = features[0];

        var popup = new mapboxgl.Popup()
          .setLngLat(map.unproject(e.point))
          .setHTML(`<dl>
            <dt>Status</dt><dd>${feature.properties.status}</dd>
            <dt>Voltage</dt><dd>${feature.properties.voltage_kV}kV</dd>
          </dl>`)
        .addTo(theMap);
      })
      // Use the same approach as above to indicate that the symbols are clickable
      // by changing the cursor style to 'pointer'.
      theMap.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['data'] });
        theMap.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
      })

      // Filter the map data by property
      document.getElementById('filter').addEventListener('click',function(e) {
        if(e.target && e.target.className == 'status-filter') {
          var clickedOption = e.target.innerText.toLowerCase();
          e.preventDefault();

          switch (clickedOption) {
            case 'all':
              map.setFilter('data', ['!=', 'status', 'Decommissioned']);
              break
            case 'planned':
              map.setFilter('data', ['in', 'status', 'Planned', 'Construction'])
              break
            case 'existing':
              map.setFilter('data', ['==', 'status', 'Existing'])
          }

          // Remove .active from all items
          document.querySelectorAll('.status-filter').forEach(function(o) {o.classList.remove('active')})
          e.target.classList.add('active')
        }
      })
    })
  })
};

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