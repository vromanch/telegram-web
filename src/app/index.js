import Router from './router';
import {Core} from './core';

export default class App {
    constructor() {
        const router = new Router();
        new Core();
        router.init();
    }
}
