function compLayer(first, second) {
  // Sorts Layers by Name
  let a = Number(first.feature.properties.zip);
  let b = Number(second.feature.properties.zip);
  console.log(a);
  console.log(b);
  return a-b;
}

function makePage() {

  // Chicago Lat, Long
  const lat = 41.8681;
  const long = -87.635;

  // Make Map
  var map = L.map("map_id", {
    zoomSnap: .5,
  }).setView([lat, long], 10);

  var layersControl = L.control.layers({},{}, options = {
    sortLayers:true
  }).addTo(map);

  // Street Title Layer
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 13,
    id: 'mapbox/streets-v10',
    accessToken: APIKEY
}).addTo(map);

// ZIP Layering
d3.json("/static/resources/zip_boundaries.geojson", function(data) {
  L.geoJSON(data.features, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`ZIP: ${feature.properties.zip}`);
      layersControl.addOverlay(layer, `${feature.properties.zip}`);
    }
  }).addTo(map);
});

  // Control

  // makePage END
};

makePage();
