function GeoLocationManager() {
    var lastCoords = false

    function isAvailable() {
        return navigator.geolocation !== undefined
    }

    function getPosition(force) {
        if (!force && lastCoords) {
            return Promise.resolve(lastCoords);
        }
        if (!isAvailable()) {
            return Promise.reject();
        }

        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(function (position) {
                lastCoords = {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                }

                resolve(lastCoords)
            });
        });
    }

    return {
        getPosition: getPosition,
        isAvailable: isAvailable
    }
}