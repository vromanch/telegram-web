import Router from './router';
import {Core} from './core';
import MTProto from '../../lib/telegram-mtproto/lib';

const api = {
    invokeWithLayer: 0xda9b0d0d,
    layer: 57,
    initConnection: 0x69796de9,
    api_id: 49631,
    app_version: '1.0.1',
    lang_code: 'en',
};

const server = {webogram: false, dev: true};

const telegram = MTProto({api, server});

const config = {
    // NOTE: if you FORK the project you MUST use your APP ID.
    // Otherwise YOUR APPLICATION WILL BE BLOCKED BY TELEGRAM
    // You can obtain your own APP ID for your application here: https://my.telegram.org
    id: 1060682,
    hash: 'a6e8015f6874ca0881956170078e5899',
};

const login = async () => {
    try {
        // const phone = await inputField('phone')
        // console.log(phone)
        const phone = '+380679343020';
        console.log('sendcode!');
        debugger;
        const {phone_code_hash} = await telegram('auth.sendCode', {
            phone_number: phone,
            api_id: config.id,
            api_hash: config.hash,
        });
        console.log('code send!');
        // const code = await inputField('code')
        const code = '22222';
        let res;
        try {
            res = await telegram('auth.signIn', {
                phone_number: phone,
                phone_code_hash,
                phone_code: code,
            });
        } catch (error) {
            if (error.type !== 'SESSION_PASSWORD_NEEDED') throw error;

            const password = 'sekrit';
            const {current_salt} = await telegram('account.getPassword', {});
            const password_hash = crypto
                .createHash('sha256')
                .update(current_salt + password + current_salt)
                .digest();
            res = await telegram('auth.checkPassword', {
                password_hash,
            });
        }
        const {user} = res;
        const {first_name = '', username = ''} = user;
        console.log('signIn', first_name, username, user.phone);
        return first_name;
    } catch (error) {
        console.error(error);
    }
};

login();

// const phone = {
//     num: '+380679343020',
//     code: '11111',
// };

// const api = {
//     layer: 57,
//     initConnection: 0x69796de9,
//     api_id: 1060682,
// };

// const server = {
//     dev: true, //We will connect to the test server.
// }; //Any empty configurations fields can just not be specified

// const client = MTProto({server, api});

// async function connect() {
//     console.log('connect!');
//     const {phone_code_hash} = await client('auth.sendCode', {
//         phone_number: phone.num,
//         current_number: true,
//         api_id: 1060682, // obtain your api_id from telegram
//         api_hash: 'a6e8015f6874ca0881956170078e5899', // obtain api_hash from telegram
//     });
//     console.log('send code');
//     const {user} = await client('auth.signIn', {
//         phone_number: phone.num,
//         phone_code_hash: phone_code_hash,
//         phone_code: phone.code,
//     });
//     console.log('signed as ', user);
// }

// connect();

// // export default class App {
// //     constructor() {
// //         const router = new Router();
// //         new Core();
// //         router.init();
// //     }
// // }
