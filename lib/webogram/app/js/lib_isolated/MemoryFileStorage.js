
function MemoryFileStorage(FileManager) {
    var storage = {}

    function isAvailable() {
        return true;
    }

    function getFile(fileName, size) {
        if (storage[fileName]) {
            return Promise.resolve(storage[fileName]);
        }

        return Promise.reject(new Error('FILE_NOT_FOUND'));
    }

    function saveFile(fileName, blob) {
        return Promise.resolve(storage[fileName] = blob);
    }

    function getFileWriter(fileName, mimeType) {
        var fakeWriter = FileManager.getFakeFileWriter(mimeType, function (blob) {
            saveFile(fileName, blob);
        });

        return Promise.resolve(fakeWriter);
    }

    return {
        name: 'Memory',
        isAvailable: isAvailable,
        saveFile: saveFile,
        getFile: getFile,
        getFileWriter: getFileWriter
    };
}
