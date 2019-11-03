import Login from '../pages/login';

export default class Router {
    constructor() {
        this.routes = [{uri: '/login', component: Login}];
    }

    init() {
        this.routes.some(route => {
            let path = window.location.pathname;

            if (path.startsWith(route.uri)) {
                // our route logic is true, return the corresponding callback

                let req = {path};
                const pageInstance = new route.component(req);
                pageInstance.abc = 'hello world';
                window.page = pageInstance;
                return Router.inject(pageInstance);
            }
        });
    }

    static inject(component) {
        const outlet = document.querySelector('router-outlet');
        while (outlet.firstChild) {
            outlet.removeChild(outlet.firstChild);
        }

        outlet.appendChild(component);
    }
}
