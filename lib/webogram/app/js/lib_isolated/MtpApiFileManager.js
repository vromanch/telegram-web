
function MtpApiFileManager(MtpApiManager, qSync, FileManager, IdbFileStorage, TmpfsFileStorage, MemoryFileStorage, WebpManager) {
    // TODO (vserhiienko), unused.
    // var cachedFs = false
    // var cachedFsPromise = false

    var cachedSavePromises = {}
    var cachedDownloadPromises = {}
    var cachedDownloads = {}

    var downloadPulls = {}
    var downloadActives = {}

    function downloadRequest(dcID, cb, activeDelta) {
        if (downloadPulls[dcID] === undefined) {
            downloadPulls[dcID] = []
            downloadActives[dcID] = 0
        }

        var downloadPull = downloadPulls[dcID]
        return new Promise((resolve, reject) => {
            downloadPull.push({ cb: cb, resolveCallback: resolve, rejectCallback: reject, activeDelta: activeDelta })
            setZeroTimeout(function () {
                downloadCheck(dcID);
            });
        });
    }

    var index = 0

    function downloadCheck(dcID) {
        var downloadPull = downloadPulls[dcID]
        var downloadLimit = dcID == 'upload' ? 11 : 5

        if (downloadActives[dcID] >= downloadLimit || !downloadPull || !downloadPull.length) {
            return false
        }

        var data = downloadPull.shift()
        var activeDelta = data.activeDelta || 1

        downloadActives[dcID] += activeDelta

        var a = index++
        data.cb()
            .then(function (result) {
                downloadActives[dcID] -= activeDelta
                downloadCheck(dcID)

                data.resolveCallback(result)
            }, function (error) {
                downloadActives[dcID] -= activeDelta
                downloadCheck(dcID)

                data.rejectCallback(error)
            })
    }

    function getFileName(location) {
        switch (location._) {
            case 'inputDocumentFileLocation':
                var fileName = (location.file_name || '').split('.', 2)
                var ext = fileName[1] || ''
                if (location.sticker && !WebpManager.isWebpSupported()) {
                    ext += '.png'
                }
                var versionPart = location.version ? ('v' + location.version) : ''
                return fileName[0] + '_' + location.id + versionPart + '.' + ext

            default:
                if (!location.volume_id) {
                    console.trace('Empty location', location)
                }
                var ext = 'jpg'
                if (location.sticker) {
                    ext = WebpManager.isWebpSupported() ? 'webp' : 'png'
                }
                return location.volume_id + '_' + location.local_id + '_' + location.secret + '.' + ext
        }
    }

    // TODO (vserhiienko), unused.
    // function getTempFileName(file) {
    //     var size = file.size || -1
    //     var random = nextRandomInt(0xFFFFFFFF)
    //     return '_temp' + random + '_' + size
    // }

    function getCachedFile(location) {
        if (!location) {
            return false
        }
        var fileName = getFileName(location)

        return cachedDownloads[fileName] || false
    }

    function getFileStorage() {
        if (!Config.Modes.memory_only) {
            if (TmpfsFileStorage.isAvailable()) {
                return TmpfsFileStorage
            }
            if (IdbFileStorage.isAvailable()) {
                return IdbFileStorage
            }
        }
        return MemoryFileStorage
    }

    function saveSmallFile(location, bytes) {
        var fileName = getFileName(location)
        var mimeType = 'image/jpeg'

        if (!cachedSavePromises[fileName]) {
            cachedSavePromises[fileName] = getFileStorage().saveFile(fileName, bytes).then(function (blob) {
                return cachedDownloads[fileName] = blob
            }, function (error) {
                delete cachedSavePromises[fileName]
            })
        }
        return cachedSavePromises[fileName]
    }

    function downloadSmallFile(location) {
        if (!FileManager.isAvailable()) {
            return Promise.reject({ type: 'BROWSER_BLOB_NOT_SUPPORTED' })
        }
        var fileName = getFileName(location)
        var mimeType = location.sticker ? 'image/webp' : 'image/jpeg'
        var cachedPromise = cachedSavePromises[fileName] || cachedDownloadPromises[fileName]

        if (cachedPromise) {
            return cachedPromise
        }

        var fileStorage = getFileStorage()

        return cachedDownloadPromises[fileName] = fileStorage.getFile(fileName).then(function (blob) {
            return cachedDownloads[fileName] = blob
        }, function () {
            var downloadPromise = downloadRequest(location.dc_id, function () {
                var inputLocation = location
                if (!inputLocation._ || inputLocation._ == 'fileLocation') {
                    inputLocation = angular.extend({}, location, { _: 'inputFileLocation' })
                }
                // console.log('next small promise')
                return MtpApiManager.invokeApi('upload.getFile', {
                    location: inputLocation,
                    offset: 0,
                    limit: 1024 * 1024
                }, {
                    dcID: location.dc_id,
                    fileDownload: true,
                    createNetworker: true,
                    noErrorBox: true
                })
            })

            var processDownloaded = function (bytes) {
                if (!location.sticker || WebpManager.isWebpSupported()) {
                    return qSync.when(bytes)
                }
                return WebpManager.getPngBlobFromWebp(bytes)
            }

            return fileStorage.getFileWriter(fileName, mimeType).then(function (fileWriter) {
                return downloadPromise.then(function (result) {
                    return processDownloaded(result.bytes).then(function (proccessedResult) {
                        return FileManager.write(fileWriter, proccessedResult).then(function () {
                            return cachedDownloads[fileName] = fileWriter.finalize()
                        })
                    })
                })
            })
        })
    }

    function getDownloadedFile(location, size) {
        var fileStorage = getFileStorage()
        var fileName = getFileName(location)

        return fileStorage.getFile(fileName, size)
    }

    function downloadFile(dcID, location, size, options) {
        if (!FileManager.isAvailable()) {
            return Promise.reject({ type: 'BROWSER_BLOB_NOT_SUPPORTED' })
        }

        options = options || {}

        var processSticker = false
        if (location.sticker && !WebpManager.isWebpSupported()) {
            if (options.toFileEntry || size > 524288) {
                delete location.sticker
            } else {
                processSticker = true
                options.mime = 'image/png'
            }
        }

        // console.log(dT(), 'Dload file', dcID, location, size)
        var fileName = getFileName(location)
        var toFileEntry = options.toFileEntry || null
        var cachedPromise = cachedSavePromises[fileName] || cachedDownloadPromises[fileName]

        var fileStorage = getFileStorage()

        // console.log(dT(), 'fs', fileStorage.name, fileName, cachedPromise)

        if (cachedPromise) {
            if (toFileEntry) {
                return cachedPromise.then(function (blob) {
                    return FileManager.copy(blob, toFileEntry)
                })
            }
            return cachedPromise
        }

        var canceled = false;
        var resolved = false;

        var deferred = new Promise((deferredResolve, deferredReject) => {
            var mimeType = options.mime || 'image/jpeg';
            var cacheFileWriter;
            var errorHandler = function (error) {
                deferredReject(error)
                errorHandler = angular.noop
                if (cacheFileWriter &&
                    (!error || error.type != 'DOWNLOAD_CANCELED')) {
                    cacheFileWriter.truncate(0)
                }
            }

            fileStorage.getFile(fileName, size).then(function (blob) {
                if (toFileEntry) {
                    FileManager.copy(blob, toFileEntry).then(function () {
                        deferredResolve()
                    }, errorHandler)
                } else {
                    // TODO (vserhiienko), legit?
                    cachedDownloads[fileName] = blob;
                    deferredResolve(blob);
                }
            }, function () {
                var fileWriterPromise = toFileEntry
                    ? FileManager.getFileWriter(toFileEntry)
                    : fileStorage.getFileWriter(fileName, mimeType)

                var processDownloaded = function (bytes) {
                    if (!processSticker) {
                        return qSync.when(bytes)
                    }
                    return WebpManager.getPngBlobFromWebp(bytes)
                }

                fileWriterPromise.then(function (fileWriter) {

                    cacheFileWriter = fileWriter;
                    var limit = 524288; // TODO (vserhiienko), limit?
                    var offset = 0;
                    var startOffset = 0;
                    var writeFilePromise = Promise.resolve();

                    if (fileWriter.length) {
                        startOffset = fileWriter.length
                        if (startOffset >= size) {
                            if (toFileEntry) {
                                deferredResolve()
                            } else {
                                var downloadedFile = fileWriter.finalize();
                                cachedDownloads[fileName] = downloadedFile;
                                deferredResolve(downloadedFile);
                            }

                            return;
                        }

                        fileWriter.seek(startOffset);

                        // TODO (vserhiienko), not progress will be availalbe, remove all progress listeners.
                        // deferred.notify({ done: startOffset, total: size })
                    }

                    for (offset = startOffset; offset < size; offset += limit) {
                        var prevWriteFilePromise = writeFilePromise;

                        // TODO (vserhiienko), writeFileDeferredReject is unused, why?
                        var newWriteFileDeferred = new Promise((writeFileDeferredResolve, writeFileDeferredReject) => {
                            ; (function (isFinal, offset, writeFilePromise) {
                                return downloadRequest(dcID, function () {
                                    if (canceled) {
                                        return Promise.resolve();
                                    }

                                    return MtpApiManager.invokeApi('upload.getFile', {
                                        location: location,
                                        offset: offset,
                                        limit: limit
                                    }, {
                                        dcID: dcID,
                                        fileDownload: true,
                                        singleInRequest: window.safari !== undefined,
                                        createNetworker: true
                                    });
                                }, 2).then(function (result) {
                                    writeFilePromise.then(function () {
                                        if (canceled) {
                                            return Promise.resolve();
                                        }

                                        return processDownloaded(result.bytes).then(function (processedResult) {
                                            return FileManager.write(fileWriter, processedResult).then(function () {
                                                writeFileDeferredResolve();
                                            }, errorHandler).then(function () {

                                                if (isFinal) {
                                                    resolved = true;
                                                    if (toFileEntry) {
                                                        deferredResolve();
                                                    } else {
                                                        var downloadedFile = fileWriter.finalize();
                                                        cachedDownloads[fileName] = downloadedFile;
                                                        deferredResolve(downloadedFile);
                                                    }
                                                }

                                                // else {
                                                    // TODO (vserhiienko), not progress will be availalbe, remove all progress listeners.
                                                    // deferred.notify({ done: offset + limit, total: size })
                                                // }
                                            })
                                        })
                                    })
                                })
                            })(offset + limit >= size, offset, prevWriteFilePromise);
                            writeFilePromise = newWriteFileDeferred;
                        }); // writeFilePromise
                    }
                }); // fileWriterPromise

            }); // fileStorage
        }); // deferred
        
        deferred.cancel = function () {
            if (!canceled && !resolved) {
                canceled = true;
                delete cachedDownloadPromises[fileName];
                errorHandler({ type: 'DOWNLOAD_CANCELED' });
            }
        };

        if (!toFileEntry) {
            cachedDownloadPromises[fileName] = deferred;
        }

        return deferred;
    }

    function uploadFile(file) {
        var fileSize = file.size;
        var isBigFile = fileSize >= 10485760;
        var canceled = false;
        var resolved = false;
        var doneParts = 0;
        var partSize = 262144; // 256 Kb
        var activeDelta = 2;

        if (fileSize > 67108864) {
            partSize = 524288;
            activeDelta = 4;
        }
        else if (fileSize < 102400) {
            partSize = 32768;
            activeDelta = 1;
        }

        var totalParts = Math.ceil(fileSize / partSize);
        if (totalParts > 3000) {
            return Promise.reject({ type: 'FILE_TOO_BIG' });
        }

        var fileID = [nextRandomInt(0xFFFFFFFF), nextRandomInt(0xFFFFFFFF)];
        var deferred = new Promise((deferredResolve, deferredReject) => { 
            var errorHandler = function (error) {
                // console.error('Up Error', error)
                deferredReject(error);
                canceled = true;
                errorHandler = angular.noop; // TODO (vserhiienko), angular?
            };

            var part = 0;
            var offset;
            var resultInputFile = {
                _: isBigFile ? 'inputFileBig' : 'inputFile',
                id: fileID,
                parts: totalParts,
                name: file.name,
                md5_checksum: ''
            };

            for (offset = 0; offset < fileSize; offset += partSize) {
                (function (offset, part) {
                    downloadRequest('upload', function () {
                        return new Promise((uploadDeferredResolve, uploadDeferredReject) => {
                            var reader = new FileReader();
                            var blob = file.slice(offset, offset + partSize);

                            reader.onloadend = function (e) {
                                if (canceled) {
                                    uploadDeferredReject()
                                    return
                                }
                                if (e.target.readyState != FileReader.DONE) {
                                    return
                                }
                                MtpApiManager.invokeApi(isBigFile ? 'upload.saveBigFilePart' : 'upload.saveFilePart', {
                                    file_id: fileID,
                                    file_part: part,
                                    file_total_parts: totalParts,
                                    bytes: e.target.result
                                }, {
                                    startMaxLength: partSize + 256,
                                    fileUpload: true,
                                    singleInRequest: true
                                }).then(function (result) {
                                    doneParts++;
                                    uploadDeferredResolve();
                                    if (doneParts >= totalParts) {
                                        deferredResolve(resultInputFile);
                                        resolved = true;
                                    }
                                    
                                    // TODO (vserhiienko), progress is ignored.
                                    // else {
                                    //     console.log(dT(), 'Progress', doneParts * partSize / fileSize)
                                    //     deferred.notify({ done: doneParts * partSize, total: fileSize })
                                    // }

                                }, errorHandler)
                            }

                            reader.readAsArrayBuffer(blob)
                        });
                    }, activeDelta)
                })(offset, part++)
            }
        });

        deferred.cancel = function () {
            console.log('cancel upload', canceled, resolved)
            if (!canceled && !resolved) {
                canceled = true
                errorHandler({ type: 'UPLOAD_CANCELED' })
            }
        }

        return deferred;
    }

    return {
        getCachedFile: getCachedFile,
        getDownloadedFile: getDownloadedFile,
        downloadFile: downloadFile,
        downloadSmallFile: downloadSmallFile,
        saveSmallFile: saveSmallFile,
        uploadFile: uploadFile
    }
}
