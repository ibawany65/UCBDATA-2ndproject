/* Flask Methods and Listeners */

function sendRestRequest(event) {
  // Add to individual geoJSON Layers.
  // Use to send ZIP, YEAR, INVENTORY|PRICE

  var params = {};
  params.year = yearSlider.node().value;

  // event.target.feature.properties.zip
  params.zip = event.target.feature.properties.zip;

  if (priceBtn.classed("active")) {
    params.format = "price";
  } else {
    params.format = "inventory";
  }

  var query = toQueryString(params);

  var data = getRestCall("/data"+query);
};

function toQueryString(obj) {
  // Formats a query string

  var query = '?';
  let params = Object.entries(obj);

  // for each param, add to query
  for (let p of params) {
    query = query + `${p[0]}=${p[1]}` + '&';
  }

  query = query.slice(0,-1);

  return query;
}

async function getRestCall(url = '') {
  // Fetch url data and await Mongo Response
  // Returns: JSON object
  
  const response = await fetch(url, init={
    method: 'GET',
    cache: 'no-cache',
  });

  if (response.ok) {
    response.json().then( data => {
      console.log(data);
    });
  } else {
    console.log('ERROR', response.statusText);
  }
};
