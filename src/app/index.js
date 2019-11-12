import Router from './router';

export default class App {
    constructor() {
        this.router = new Router();
        this.router.init();
    }
}
