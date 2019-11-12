
function FileManager(qSync) {
    window.URL = window.URL || window.webkitURL;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

    var isSafari = 'safari' in window;
    var safariVersion = parseFloat(isSafari && (navigator.userAgent.match(/Version\/(\d+\.\d+).* Safari/) || [])[1]);
    var safariWithDownload = isSafari && safariVersion >= 11.0;
    var buggyUnknownBlob = isSafari && !safariWithDownload;
    var blobSupported = true;

    try {
        blobConstruct([], '');
    } catch (e) {
        blobSupported = false;
    }

    function isBlobAvailable() {
        return blobSupported;
    }

    function fileCopyTo(fromFileEntry, toFileEntry) {
        return getFileWriter(toFileEntry).then(function (fileWriter) {
            return fileWriteData(fileWriter, fromFileEntry).then(function () {
                return fileWriter;
            }, function (error) {
                try {
                    fileWriter.truncate(0);
                } catch (e) { }
                return Promise.reject(error);
            })
        })
    }

    function fileWriteData(fileWriter, bytes) {
        return new Promise((resolve, reject) => {

            fileWriter.onwriteend = function (e) { resolve() }
            fileWriter.onerror = function (e) { reject(e) }

            if (bytes.file) {
                bytes.file(function (file) {
                    fileWriter.write(file)
                }, function (error) {
                    reject(error)
                })
            }
            else if (bytes instanceof Blob) {
                 // is file bytes
                fileWriter.write(bytes)
            } else {
                try {
                    var blob = blobConstruct([bytesToArrayBuffer(bytes)])
                    fileWriter.write(blob)
                } catch (e) {
                    reject(e)
                }
            }
        });
    }

    function chooseSaveFile(fileName, ext, mimeType) {
        if (!window.chrome || !chrome.fileSystem || !chrome.fileSystem.chooseEntry) {
            return qSync.reject()
        }

        return new Promise(resolve => {
            chrome.fileSystem.chooseEntry({
                type: 'saveFile',
                suggestedName: fileName,
                accepts: [{
                    mimeTypes: [mimeType],
                    extensions: [ext]
                }]
            }, function (writableFileEntry) {
                resolve(writableFileEntry)
            });
        });
    }

    function getFileWriter(fileEntry) {
        return new Promise((resolve, reject) => {
            fileEntry.createWriter(function (fileWriter) {
                resolve(fileWriter)
            }, function (error) {
                reject(error)
            })
        });
    }

    function getFakeFileWriter(mimeType, saveFileCallback) {
        var blobParts = []
        var fakeFileWriter = {
            write: function (blob) {
                if (!blobSupported) {
                    if (fakeFileWriter.onerror) {
                        fakeFileWriter.onerror(new Error('Blob not supported by browser'))
                    }
                    return false
                }
                blobParts.push(blob)
                setZeroTimeout(function () {
                    if (fakeFileWriter.onwriteend) {
                        fakeFileWriter.onwriteend()
                    }
                })
            },
            truncate: function () {
                blobParts = []
            },
            finalize: function () {
                var blob = blobConstruct(blobParts, mimeType)
                if (saveFileCallback) {
                    saveFileCallback(blob)
                }
                return blob
            }
        }

        return fakeFileWriter
    }

    function getUrl(fileData, mimeType) {
        var safeMimeType = blobSafeMimeType(mimeType)
        // console.log(dT(), 'get url', fileData, mimeType, fileData.toURL !== undefined, fileData instanceof Blob)
        if (fileData.toURL !== undefined) {
            return fileData.toURL(safeMimeType)
        }
        if (fileData instanceof Blob) {
            return URL.createObjectURL(fileData)
        }
        return 'data:' + safeMimeType + ';base64,' + bytesToBase64(fileData)
    }

    function getByteArray(fileData) {
        if (fileData instanceof Blob) {
            return new Promise((resolve, reject) => {
                try {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        resolve(new Uint8Array(e.target.result));
                    }
                    reader.onerror = function (e) {
                        reject(e);
                    }

                    reader.readAsArrayBuffer(fileData);
                } catch (e) {
                    reject(e)
                }
            });
        } else if (fileData.file) {
            return new Promise((resolve, reject) => {
                fileData.file(function (blob) {
                    getByteArray(blob).then(function (result) {
                        resolve(result);
                    }, function (error) {
                        reject(error);
                    });
                }, function (error) {
                    reject(error);
                });
            });
        }

        return Promise.resolve(fileData);
    }

    function getDataUrl(blob) {
        return new Promise((resolve, reject) => {
            try {
                var reader = new FileReader()
                reader.onloadend = function () {
                    resolve(reader.result);
                }
                reader.readAsDataURL(blob)
            } catch (e) {
                reject(e);
            }
        });
    }

    function getFileCorrectUrl(blob, mimeType) {
        if (buggyUnknownBlob && blob instanceof Blob) {
            var mimeType = blob.type || blob.mimeType || mimeType || ''
            if (!mimeType.match(/image\/(jpeg|gif|png|bmp)|video\/quicktime/)) {
                return getDataUrl(blob)
            }
        }
        return qSync.when(getUrl(blob, mimeType))
    }

    function downloadFile(blob, mimeType, fileName) {
        if (window.navigator && navigator.msSaveBlob !== undefined) {
            window.navigator.msSaveBlob(blob, fileName)
            return false
        }

        if (window.navigator && navigator.getDeviceStorage) {
            var storageName = 'sdcard'
            var subdir = 'telegram/'
            switch (mimeType.split('/')[0]) {
                case 'video':
                    storageName = 'videos'
                    break
                case 'audio':
                    storageName = 'music'
                    break
                case 'image':
                    storageName = 'pictures'
                    break
            }
            var deviceStorage = navigator.getDeviceStorage(storageName)

            var request = deviceStorage.addNamed(blob, subdir + fileName)

            request.onsuccess = function () {
                console.log('Device storage save result', this.result)
            }
            request.onerror = function () { }
            return
        }

        var popup = false
        if (isSafari && !safariWithDownload) {
            popup = window.open()
        }

        getFileCorrectUrl(blob, mimeType).then(function (url) {
            if (popup) {
                try {
                    popup.location.href = url
                    return
                } catch (e) { }
            }
            var anchor = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
            anchor.href = url
            if (!safariWithDownload) {
                anchor.target = '_blank'
            }
            anchor.download = fileName
            if (anchor.dataset) {
                anchor.dataset.downloadurl = ['video/quicktime', fileName, url].join(':')
            }
            $(anchor).css({ position: 'absolute', top: 1, left: 1 }).appendTo('body')

            try {
                var clickEvent = document.createEvent('MouseEvents')
                clickEvent.initMouseEvent(
                    'click', true, false, window, 0, 0, 0, 0, 0
                    , false, false, false, false, 0, null
                )
                anchor.dispatchEvent(clickEvent)
            } catch (e) {
                console.error('Download click error', e)
                try {
                    anchor[0].click()
                } catch (e) {
                    window.open(url, '_blank')
                }
            }
            setTimeout(function () {
                $(anchor).remove()
            }, 100)
        })
    }

    return {
        isAvailable: isBlobAvailable,
        copy: fileCopyTo,
        write: fileWriteData,
        getFileWriter: getFileWriter,
        getFakeFileWriter: getFakeFileWriter,
        chooseSave: chooseSaveFile,
        getUrl: getUrl,
        getDataUrl: getDataUrl,
        getByteArray: getByteArray,
        getFileCorrectUrl: getFileCorrectUrl,
        download: downloadFile
    }
}
