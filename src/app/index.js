import Router from './router';
import {Core} from './core';
import MTProto from '../../lib/telegram-mtproto/dist/mtproto-browser';

const phone = {
    num: '+380679343020',
    code: '11111',
};

const api = {
    layer: 57,
    initConnection: 0x69796de9,
    api_id: 1060682,
};

const server = {
    dev: false, //We will connect to the test server.
}; //Any empty configurations fields can just not be specified

const client = MTProto({server, api});

async function connect() {
    console.log('connect!');
    const {phone_code_hash} = await client('auth.sendCode', {
        phone_number: phone.num,
        current_number: false,
        api_id: 1060682, // obtain your api_id from telegram
        api_hash: 'a6e8015f6874ca0881956170078e5899', // obtain api_hash from telegram
    });
    console.log('send code');
    const {user} = await client('auth.signIn', {
        phone_number: phone.num,
        phone_code_hash: phone_code_hash,
        phone_code: phone.code,
    });
    console.log('signed as ', user);
}

connect();

// export default class App {
//     constructor() {
//         const router = new Router();
//         new Core();
//         router.init();
//     }
// }
