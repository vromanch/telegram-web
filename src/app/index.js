import Router from './router';
import {Core} from './core';

class App {
    constructor() {
        const router = new Router();
        new Core();
        router.init();
    }
}

if (
    'registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template')
) {
    new App();
} else {
    setTimeout(() => {
        new App();
    });
}
