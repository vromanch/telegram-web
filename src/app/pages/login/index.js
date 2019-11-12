import './login-form';

const template = document.createElement('template');
template.innerHTML = `
<div class="login_page">
    <login-form></login-form>
</div>
`;

export default class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('login-page', LoginPage);