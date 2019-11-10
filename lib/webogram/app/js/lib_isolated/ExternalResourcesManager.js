

// TODO (vserhiienko), untested.
function ExternalResourcesManager() {
    var urlPromises = {}

    function downloadByURL(url) {
        if (urlPromises[url] !== undefined) {
            return urlPromises[url]
        }

        var getPromise = fetch(url, { method: 'get' }).then((response) => {
            return response.blob();
        }).then(blob => {
            var URL = window.URL || window.webkitURL;
            var objURL = URL.createObjectURL(blob);
            return objURL;
        });

        urlPromises[url] = getPromise;
        return getPromise;
    }

    return {
        downloadByURL: downloadByURL
    }
}