queue()
    .defer(d3.json, "/chicagohousing/housingprices")
    .defer(d3.json, "static/geojson/chicagozip.json")
    .await(makeGraphs);

function makeGraphs(error, housingJson, chicagozipJson) {
	
	//Clean projectsJson data
	var chicagohousingdata = housingJson;
	var dateFormat = d3.time.format("%m/%d/%Y");
	//var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
	chicagohousingdata.forEach(function(d) {
		d["Period Begin"] = dateFormat.parse(d["Period Begin"]);
		d["Period Begin"].setDate(1);
		d["Homes Sold"] = +d["Homes Sold"]
		d["Inventory"] = +d["Inventory"]
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(chicagohousingdata);
	var all = ndx.groupAll();
	var totalHomes = ndx.groupAll().reduceSum(function(d) {return d["Homes Sold"];});
	var inventory = ndx.groupAll().reduceSum(function(d) {return d["Inventory"];});

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["Period Begin"]; });
	var propertyTypeDim = ndx.dimension(function(d) { return d["Property Type"]; });
	//var primarycityDIM = ndx.dimension(function(d) { return d["primary_city"]; });
	var zipcodeDim = ndx.dimension(function(d) { return d["Zip_Code"]; });
	//var HomesSoldDim  = ndx.dimension(function(d) { return d["Homes Sold"]; });
	//var mediansalepriceDIM = ndx.dimension(function(d) { return d["Median Sale Price"]; });


	//Calculate metrics
	var HousingByDate = dateDim.group().reduceSum(function(d) { return d["Homes Sold"]});
	var PropertiesByPropertyType = propertyTypeDim.group().reduceSum(function(d) { return d["Homes Sold"]});
	
	// var InventoryBYPropertyType = propertyTypeDim.group().reduceSum(function(d) { return d["Inventory"]});
	var HomeSoldByZip = zipcodeDim.group().reduceSum(function(d) {
		return d["Homes Sold"];
	});

	var max_zip = HomeSoldByZip.top(1)[0].value;
	

	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["Period Begin"];
	var maxDate = dateDim.top(1)[0]["Period Begin"];
	var minZip  = zipcodeDim.bottom(1)[0]["Zip_Code"];
	var maxZip  = zipcodeDim.top(1)[0]["Zip_Code"];

    //Charts
	var timeChart = dc.barChart("#time-chart");
	var propertyTypeChart = dc.rowChart("#resource-type-row-chart");
	//var ZipCodeChart = dc.barChart("#property-level-row-chart");
	var ZipCodeChart = dc.barChart("#us-chart");
	var usChart = dc.geoChoroplethChart("#property-level-row-chart");

	var HomesSoldND = dc.numberDisplay("#number-homes-nd");
	var InventoryND = dc.numberDisplay("#total-inventory-nd");

	HomesSoldND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(totalHomes)
		.formatNumber(d3.format(".3s"));


	InventoryND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(inventory)
		.formatNumber(d3.format(".3s"));

	timeChart
		.width(600)
		.height(260)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(dateDim)
		.group(HousingByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxis().ticks(4);

	propertyTypeChart
        .width(350)
        .height(250)
        .dimension(propertyTypeDim)
        .group(PropertiesByPropertyType)
        .xAxis().ticks(4);

	//ZipCodeChart
	//	.width(550)
	//	.height(350)
    //   .dimension(zipcodeDim)
    //    .group(HomeSoldByZip)
    //    .xAxis().ticks(60);

	ZipCodeChart
		.width(1400)
		.height(250)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.brushOn(false)
		.yAxisLabel("Homes Sold")
    	.dimension(zipcodeDim)
		.group(HomeSoldByZip)
		.x(d3.scale.ordinal().domain(zipcodeDim))
		.xUnits(dc.units.ordinal)
		.renderlet(function (chart) {
			chart.selectAll("g.x text")
			.attr('dx', '-15')
			.attr('transform', "rotate(-45)");
		});

	
	usChart
	    .width(1000)
		.height(330)
		.dimension(zipcodeDim)
		.group(HomeSoldByZip)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		.colorDomain([0, 200])
		.overlayGeoJson(chicagozipJson["features"], "zipcode", function (d) {
			return d.properties.zip;
		})
		.projection(d3.geo.albersUsa()
    				.scale(600)
    				.translate([340, 150]))
		.title(function (p) {
			return "zipcode: " + p["key"]
					+ "\n"
					+ "Homes Sold: " + Math.round(p["value"]);
		})

    dc.renderAll();

};