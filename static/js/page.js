function makePage() {

  // Chicago Lat, Long
  const lat = 41.8781;
  const long = -87.6298;

  // Make Map
  var map = L.map("map_id").setView([lat, long], 13);

  // Street Title Layer
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: APIKEY
}).addTo(map);
};

makePage();
