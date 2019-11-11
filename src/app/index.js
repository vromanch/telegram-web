import Router from './router';
import { Core } from './core';
// import { Telegram } from './telegram';

export default class App {
    constructor() {
        this.router = new Router();
        this.core = new Core();
        // new Telegram();
        this.router.init();
    }
}
