import Router from './router';
import {Core} from './core';

export default class App {
    constructor() {
        this.router = new Router();
        this.core = new Core();
        
        this.router.init();
    }
}
