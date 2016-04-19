
function getReadableTime(timeInMs) {
	if (timeInMs < 1000) {
		return timeInMs.toFixed(2) + "ms";
	} else {
		return (timeInMs/1000).toFixed(2) + "s";
	}
}

function getReadableSize(sizeInBytes) {
	if (sizeInBytes < 1024) {
		return parseInt(sizeInBytes) + "B";
	} else {
		return (sizeInBytes/1024).toFixed(2) + "KB";
	}
}
