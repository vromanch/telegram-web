const template = document.createElement('template');
template.innerHTML = `
<div class="login_page">
    <span class="logo"></span>
    <h1>Sign in to Telegram</h1>
    <p class="sub-type">Please confirm your country and enter your phone number.</p>
    <form>
        <country-field name="country" label="Country"></country-field>
    </form>
</div>
`;

import './index.scss';

export default class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.submitButton = null;
        this.onSubmit = this.onSubmit.bind(this);

        this.appendChild(template.content.cloneNode(true));

        // this.submitButton = this.querySelector('[type=submit]');
        // this.submitButton.addEventListener('click', this.onSubmit);
    }

    static get observedAttributes() {
        return [];
    }

    connectedCallback() {
        console.log('connected!');
    }
    attributeChangedCallback() {}
    onSubmit(event) {
        event.preventDefault();
        console.log('on submit!');
    }
    disconnectedCallback() {
        // this.submitButton.removeEventListener('click', this.onSubmit);
    }
}
