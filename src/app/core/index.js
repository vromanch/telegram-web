import Registry from './registry';
import LoginPage from '../pages/login';
import SigninPage from '../pages/signin';
import CodePage from '../pages/code';

import FormField from '../components/form-field';
import CountryField from '../components/country-field';
import PhoneNumberField from '../components/phone-number-field';
import DropDown from '../components/drop-down';
import CountryLine from '../components/country-line';


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
    {
        tagName: 'code-page',
        component: CodePage,
    },
    {
        tagName: 'form-field',
        component: FormField,
    },
    {
        tagName: 'country-field',
        component: CountryField,
    },
    {
        tagName: 'phone-number-field',
        component: PhoneNumberField,
    },
    {
        tagName: 'drop-down',
        component: DropDown,
    },
    {
        tagName: 'country-line',
        component: CountryLine,
    }
];
