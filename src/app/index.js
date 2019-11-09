import Router from './router';
import { Core } from './core';
import { Telegram } from './telegram';

export default class App {
    constructor() {
        const router = new Router();
        new Core();
        new Telegram();
        router.init();
    }
}
