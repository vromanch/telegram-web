import {COUNTRIES} from '../../constants/countries';

const template = document.createElement('template');
template.innerHTML = `
<div class="login_page">
    <span class="logo"></span>
    <h1>Sign in to Telegram</h1>
    <p class="sub-type">Please confirm your country and enter your phone number.</p>
    <form autocomplete="off">
        <country-field name="country" label="Country"></country-field>
        <form-field name="phone" label="Phone Number"></form-field>
    </form>
</div>
`;

import './index.scss';

export default class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.submitButton = null;
        this.onCountrySelected = this.onCountrySelected.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.appendChild(template.content.cloneNode(true));

        this.form = this.querySelector('form');
        this.form.addEventListener('change', this.onCountrySelected); 
        this.$phoneField = this.querySelector('form-field[name="phone"]');

        // this.submitButton = this.querySelector('[type=submit]');
        // this.submitButton.addEventListener('click', this.onSubmit);
    }

    static get observedAttributes() {
        return [];
    }

    onCountrySelected(event) {
        const inputName = event.target.getAttribute('name');
        if (inputName === 'country') {
            const code = event.target.getAttribute('code');
            const country = COUNTRIES.find(country => country.code === code);
            
            this.updatePhonePrefix(country.prefix);
            this.$phoneField.focus();
        }
    }

    updatePhonePrefix(prefix) {
        this.$phoneField.value = prefix;
    }

    connectedCallback() {
    }
    attributeChangedCallback() {}
    onSubmit(event) {
        event.preventDefault();
    }
    disconnectedCallback() {
        // this.submitButton.removeEventListener('click', this.onSubmit);
    }
}
