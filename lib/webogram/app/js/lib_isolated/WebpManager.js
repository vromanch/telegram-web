
function WebpManager(qSync) {
    var nativeWebpSupport = false

    var image = new Image()
    image.onload = function () {
        nativeWebpSupport = this.width === 2 && this.height === 1
    }
    image.onerror = function () {
        nativeWebpSupport = false
    }
    image.src = 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA=='

    var canvas
    var context

    function getCanvasFromWebp(data) {
        var start = tsNow()

        var decoder = new WebPDecoder()

        var config = decoder.WebPDecoderConfig
        var buffer = config.j || config.output
        var bitstream = config.input

        if (!decoder.WebPInitDecoderConfig(config)) {
            console.error('[webpjs] Library version mismatch!')
            return false
        }

        // console.log('[webpjs] status code', decoder.VP8StatusCode)
        var StatusCode = decoder.VP8StatusCode

        status = decoder.WebPGetFeatures(data, data.length, bitstream)
        if (status != (StatusCode.VP8_STATUS_OK || 0)) {
            console.error('[webpjs] status error', status, StatusCode)
        }

        var mode = decoder.WEBP_CSP_MODE
        buffer.colorspace = mode.MODE_RGBA
        buffer.J = 4

        try {
            status = decoder.WebPDecode(data, data.length, config)
        } catch (e) {
            status = e
        }

        ok = (status == 0)
        if (!ok) {
            console.error('[webpjs] decoding failed', status, StatusCode)
            return false
        }

        // console.log('[webpjs] decoded: ', buffer.width, buffer.height, bitstream.has_alpha, 'Now saving...')
        var bitmap = buffer.c.RGBA.ma

        // console.log('[webpjs] done in ', tsNow() - start)

        if (!bitmap) {
            return false
        }
        var biHeight = buffer.height
        var biWidth = buffer.width

        if (!canvas || !context) {
            canvas = document.createElement('canvas')
            context = canvas.getContext('2d')
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height)
        }
        canvas.height = biHeight
        canvas.width = biWidth

        var output = context.createImageData(canvas.width, canvas.height)
        var outputData = output.data

        for (var h = 0; h < biHeight; h++) {
            for (var w = 0; w < biWidth; w++) {
                outputData[0 + w * 4 + (biWidth * 4) * h] = bitmap[1 + w * 4 + (biWidth * 4) * h]
                outputData[1 + w * 4 + (biWidth * 4) * h] = bitmap[2 + w * 4 + (biWidth * 4) * h]
                outputData[2 + w * 4 + (biWidth * 4) * h] = bitmap[3 + w * 4 + (biWidth * 4) * h]
                outputData[3 + w * 4 + (biWidth * 4) * h] = bitmap[0 + w * 4 + (biWidth * 4) * h]
            }
        }

        context.putImageData(output, 0, 0)

        return true
    }

    function getPngBlobFromWebp(data) {
        if (!getCanvasFromWebp(data)) {
            return Promise.reject({ type: 'WEBP_PROCESS_FAILED' })
        }
        if (canvas.toBlob === undefined) {
            return qSync.when(dataUrlToBlob(canvas.toDataURL('image/png')))
        }

        return new Promise((resolve, reject) => {
            canvas.toBlob(function (blob) { resolve(blob) }, 'image/png');
        });
    }

    return {
        isWebpSupported: function () {
            return nativeWebpSupport
        },
        getPngBlobFromWebp: getPngBlobFromWebp
    }
}
