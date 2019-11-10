function Storage() {
    this.setPrefix = function (newPrefix) {
        ConfigStorage.prefix(newPrefix)
    }

    this.$get = [function () {
        var methods = {}
        Array.polymorphicForEach(['get', 'set', 'remove', 'clear'], function (methodName) {
            methods[methodName] = function () {
                var args = Array.prototype.slice.call(arguments);
                return new Promise(resolve => {
                    args.push(function (result) { resolve(result) });
                    ConfigStorage[methodName].apply(ConfigStorage, args)
                });
            }
        })

        methods.noPrefix = function () {
            ConfigStorage.noPrefix()
        };

        return methods;
    }]
}