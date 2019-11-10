
function ServerTimeManager(Storage) {
    var timestampNow = tsNow(true)
    var midnightNoOffset = timestampNow - (timestampNow % 86400)
    var midnightOffseted = new Date()
    midnightOffseted.setHours(0)
    midnightOffseted.setMinutes(0)
    midnightOffseted.setSeconds(0)

    var midnightOffset = midnightNoOffset - (Math.floor(+midnightOffseted / 1000))

    var serverTimeOffset = 0
    var timeParams = {
        midnightOffset: midnightOffset,
        serverTimeOffset: serverTimeOffset
    }

    Storage.get('server_time_offset').then(function (to) {
        if (to) {
            serverTimeOffset = to
            timeParams.serverTimeOffset = to
        }
    })

    return timeParams
}