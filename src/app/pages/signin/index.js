const template = document.createElement('template');
template.innerHTML = `
<div class="signin_page">
    <span class="logo"></span>
    <h1>Sign in to Telegram</h1>
    <p>Please enter your phone number.</p>
    <form>
        <input type="text" placeholder="Phone" name="phone">
        <input type="submit" value="Code">
    </form>
</div>
`;

import './index.scss';
import { Telegram } from '../../telegram';

export default class SigninPage extends HTMLElement {
    constructor() {
        super();

        this.telegram = Telegram.instance;

        this.submitButton = null;
        this.onSubmit = this.onSubmit.bind(this);

        this.appendChild(template.content.cloneNode(true));

        this.submitInput = this.querySelector('[type=text]');
        this.submitButton = this.querySelector('[type=submit]');

        console.dir(this.submitInput);
    }

    onSubmit(event) {
        event.preventDefault();
        console.log('Submitting: ' + this.submitInput.value);
        this.telegram.login(this.submitInput.value).then(function (result){
            console.log('SigninPage.login: OK');
        }, function (result){
            console.log('SigninPage.login: NOK');
        });
    }

    static get observedAttributes() { return []; }

    attributeChangedCallback() { }
    connectedCallback() { this.submitButton.addEventListener('click', this.onSubmit); }
    disconnectedCallback() { this.submitButton.removeEventListener('click', this.onSubmit); }
}
