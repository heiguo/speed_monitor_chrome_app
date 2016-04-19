chrome.storage.local.get('domainStats', function(result) {
	// sort the result
	var domainStats = result.domainStats;
	var array = [];
	for (var domain in domainStats) {
		array.push([domain, domainStats[domain]]);
	}
	array.sort(function(a, b) {
		return b[1]["count"] - a[1]["count"];
	});

	console.log(result);
	var htmlString = "<table><tr><th>domain</th><th>count</th><th>speed</th><th>avg. size</th></tr>";
	var domains = "";
	for (var i = 0; i < array.length; i++) {
		var domain = array[i][0];
		var stat = array[i][1];

  		htmlString += "<tr>";
  		htmlString += "<td>" + domain + "</td><td>";
  		htmlString += stat["count"] + "</td><td>";

  		var speed = (stat["size"] / stat["time"]).toFixed(2);
  		htmlString += speed + "KB/s</td><td class='right'>";

  		var averageSize = getReadableSize(stat["size"] / stat["count"]);
  		htmlString += averageSize + "</td>";
  		htmlString += "</tr>";
  	}

	var helloDiv = document.getElementById("hello");
	htmlString += "</table>";
	helloDiv.innerHTML = htmlString;
});