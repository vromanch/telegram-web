import Registry from './registry';
import LoginPage from '../pages/login';
import SigninPage from '../pages/signin';

export class Core {
    constructor() {
        if (!Core.inst) {
            Core.inst = this;
        } else {
            throw new Error('use instance');
        }

        Registry.register(components);

        return Core.inst;
    }

    static get instance() {
        return Core.inst;
    }
}
Core.inst = null;

const components = [
    {
        tagName: 'login-page',
        component: LoginPage,
    },
    {
        tagName: 'signin-page',
        component: SigninPage,
    },
];
