import Login from '../pages/login';
import Signin from '../pages/signin';

export default class Router {
    constructor() {
        this.routes = [{uri: '/login', component: Login},
                       {uri: '/signin', component: Signin}];
    }

    init() {
        this.routes.some(route => {
            let path = window.location.pathname;

            if (path.startsWith(route.uri)) {
                // our route logic is true, return the corresponding callback

                let req = {path};
                const pageInstance = new route.component(req);
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
