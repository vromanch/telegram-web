import './login-form';
import CodeForm from './code-form'

const template = document.createElement('template');
template.innerHTML = `
<div class="login_page">
    <login-form></login-form>
</div>
`;

import './index.scss';

export default class LoginPage extends HTMLElement {
    constructor() {
        super();

        this.phoneNumber = null;

        this.showAuthCodeForm = this.showAuthCodeForm.bind(this);
        
        this.appendChild(template.content.cloneNode(true));
        this.$wrapper = this.querySelector('.login_page');

        this.$loginForm = this.querySelector('login-form');
        this.$codeForm = this.querySelector('code-form');

        this.$loginForm.addEventListener('submit', event => {
            event.preventDefault();
            const {phoneNumber} = event.data;
            
            this.phoneNumber = phoneNumber;
            this.showAuthCodeForm();
        });
    }

    connectedCallback() {
        // this.$codeForm.setAttribute('hidden', true);
    }

    showAuthCodeForm() {
        this.$loginForm.setAttribute('hidden', true);

        const $codeForm = new CodeForm();
        $codeForm.phoneNumber = this.phoneNumber;

        this.$wrapper.appendChild($codeForm);
    }
}

window.customElements.define('login-page', LoginPage);