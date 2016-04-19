
alert("oops");

var sendHeadersTimeStamp = {};
var completeTimeStamp = {};

/*
 * send headers
 */
var sendHeadersListener = function(details) {
	sendHeadersTimeStamp[details.requestId] = details.timeStamp;
}

var filter = {urls: ["<all_urls>"]};

chrome.webRequest.onSendHeaders.addListener(sendHeadersListener, filter, []);

/*
 * complete request
 */
var completeRequestListener = function(details) {
    if (sendHeadersTimeStamp[details.requestId] && !details.fromCache && details.statusCode === 200) {
    	if (details.type === "image" || details.type === "stylesheet" || details.type === "script") {
	    	var time = details.timeStamp - sendHeadersTimeStamp[details.requestId];
	    	var size = parseInt(getContentLength(details.responseHeaders));

	    	if (size === 0) {
	    		return;
	    	}

	    	// console.log(getReadableTime(time) + ",\t" + getReadableSize(size)
	    		// + ",\t" + details.type + ",\t" + details.method + " " + truncateUrl(details.url));
	    	console.log(getReadableTime(time) + ",\t" + getReadableSize(size)
	    		+ ",\t" + details.type + ",\t" + details.method + " " + details.url);

	    	var domain = extractDomain(details.url);
	    	addOne(domain, size, time);
	    	// console.log(domainStats);
		}
    }

    completeTimeStamp[details.requestId] = details.timeStamp;

    return { cancel: false };
};

chrome.webRequest.onCompleted.addListener(completeRequestListener, filter, ["responseHeaders"]);

function truncateUrl(url) {
	var urlParts = url.split('?');
	return urlParts[0];
}

function getContentLength(responseHeaders) {
	for (var i = 0; i < responseHeaders.length; i++) {
		if (responseHeaders[i].name.toLowerCase() === 'content-length') {
			return responseHeaders[i].value;
		}
	}

	return 0;
}

/*
 * domain stats
 */
var domainStats = {};

function addOne(domain, size, time) {
	if (!domainStats[domain]) {
		domainStats[domain] = {"size": size, "time": time, "count": 1};
	} else {
		var domainStat = domainStats[domain];
		domainStats[domain] = {"size": domainStat["size"] + size,
			"time": domainStat["time"] + time,
			"count": domainStat["count"] + 1};
	}

	chrome.storage.local.set({'domainStats':domainStats});
}

function extractDomain(url) {
    var domain;

    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}