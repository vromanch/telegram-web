const { MTProto } = require('../../../lib/telegram-mtproto/lib')
const { Storage } = require('../../../lib/telegram-mtproto/node_modules/mtproto-storage-fs');

class TelegramStorage {
    constructor() {
        this.localStorage = window.localStorage;
        this.keySet = new Set();
    }

    get(key) {
        console.log('TelegramStorage.add: ' + key);
        return this.localStorage.getItem(key);
        // return _bluebird2.default.resolve((0, _fsExtra.readJsonSync)(this.file)[key]);
    }

    set(key, val) {
        console.log('TelegramStorage.set: ' + key + ' ' + val);
        this.keySet.add(key);
        return this.localStorage.setItem(key, val);
    }
    
    has(key) {
        console.log('TelegramStorage.has: ' + key);
        return this.keySet.has(key);
    }

    remove(...keys) {
        for (const key of keys) {
            console.log('TelegramStorage.remove: ' + key);
            this.localStorage.removeItem(key);
            this.keySet.delete(key);
        }
    }

    clear() {
        console.log('TelegramStorage.clear');
        this.localStorage.clear();
        this.keySet.clear();
    }
}

export class Telegram {
    constructor() {
        if (!Telegram._instance) {
            
            this._app_api_id = 915407;
            this._app_api_hash = '31949c1eeb6c9d6d386203b49a069091';
            const api = {
                invokeWithLayer: 0xda9b0d0d,
                layer          : 57,
                initConnection : 0x69796de9,
                api_id         : 915407,
                app_version    : '1.0.1',
                lang_code      : 'en'
            };

            const server = { webogram: true, dev: false };
            const app = { storage: new TelegramStorage() };

            this._mtproto = MTProto({ api, server, app });

            console.dir(this);

            Telegram._instance = this;
        } else {
            throw new Error('use instance');
        }
        return Telegram._instance;
    }

    static get instance() {
        return Telegram._instance;
    }
}
Telegram._instance = null;