// const { MTProto } = require('../../../lib/telegram-mtproto/lib')
// const { Storage } = require('../../../lib/telegram-mtproto/node_modules/mtproto-storage-fs');

// class TelegramStorage {
//     constructor() {
//         this.localStorage = window.localStorage;
//         this.keySet = new Set();
//     }

//     get(key) {
//         console.log('TelegramStorage.add: ' + key);
//         return this.localStorage.getItem(key);
//         // return _bluebird2.default.resolve((0, _fsExtra.readJsonSync)(this.file)[key]);
//     }

//     set(key, val) {
//         console.log('TelegramStorage.set: ' + key + ' ' + val);
//         this.keySet.add(key);
//         return this.localStorage.setItem(key, val);
//     }
    
//     has(key) {
//         console.log('TelegramStorage.has: ' + key);
//         return this.keySet.has(key);
//     }

//     remove(...keys) {
//         for (const key of keys) {
//             console.log('TelegramStorage.remove: ' + key);
//             this.localStorage.removeItem(key);
//             this.keySet.delete(key);
//         }
//     }

//     clear() {
//         console.log('TelegramStorage.clear');
//         this.localStorage.clear();
//         this.keySet.clear();
//     }
// }

// export class Telegram {
//     constructor() {
//         console.log('Telegram.constructor');
        
//         if (!Telegram._instance) {
//             this._app_api_id = 915407;
//             this._app_api_hash = '31949c1eeb6c9d6d386203b49a069091';

//             const api = {
//                 invokeWithLayer: 0xda9b0d0d, // TODO: ?
//                 layer          : 57,         // TODO: ?
//                 initConnection : 0x69796de9, // TODO: ?
//                 api_id         : 915407,
//                 app_version    : '1.0.1',
//                 lang_code      : 'en'
//             };

//             const server = { webogram: true, dev: false };
//             const app = { storage: new TelegramStorage() };

//             this._mtproto = MTProto({ api, server, app });

//             console.log('Telegram.constructor: this._mtproto.bus.');
//             console.dir(this._mtproto.bus);
//             console.dir(this._mtproto.bus.rpcError);


//             this._mtproto.bus.rpcError.observe(async(message) => {
//                     console.log('Telegram.rpcError: message=' + message);
//             });

//             this._mtproto.bus.rpcResult.observe(async(message) => {
//                     console.log('Telegram.rpcResult: message=' + message);
//             });
           

//             Telegram._instance = this;

//             console.log('Telegram.constructor: Constructed.');
//             console.dir(this);

//             return Telegram._instance;
//         }

//         throw new Error('use instance');
//     }

//     async login(phone /*: string */) {
//         console.log('Telegram.login');

//         const { phone_code_hash } = await this._mtproto('auth.sendCode', {
//             phone_number  : phone,
//             current_number: false,
//             api_id        : this._app_api_id,
//             api_hash      : this._app_api_hash
//         });

//         console.log('phone_code_hash');
//         console.log(phone_code_hash);
//         console.dir(phone_code_hash);

//         // this._auth_send_code = 
        
//         // this._auth_send_code.then()

//         // console.log('this._auth_send_code');
//         // console.log(this._auth_send_code);
//         // console.dir(this._auth_send_code);
//     }

//     static get instance() {
//         return Telegram._instance;
//     }
// }

// Telegram._instance = null;