import Login from '../pages/login';

export default class Router {
    constructor() {
        this.routes = [{uri: '/login', component: Login}];
    }

    init() {
        this.routes.some(route => {
            let regEx = new RegExp(`^${route.uri}$`); // i'll explain this conversion to regular expression below
            let path = window.location.pathname;

            if (path.match(regEx)) {
                // our route logic is true, return the corresponding callback

                let req = {path};
                return Router.inject(new route.component());
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
