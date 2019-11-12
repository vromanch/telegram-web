import '../../components/country-field';
import '../../components/phone-number-field';

import {COUNTRIES} from '../../constants/countries';

const template = document.createElement('template');
template.innerHTML = `
    <div class="login_form">
        <span class="logo"></span>
        <h1>Sign in to Telegram</h1>
        <p class="sub-type">Please confirm your country and enter your phone number.</p>
        <form autocomplete="off">
            <country-field name="country" label="Country"></country-field>
            <phone-number-field name="phone" label="Phone Number"></phone-number-field>
            <div class="checkbox">
                <input type="checkbox" id="save_session" name="save_session">
                <label for="save_session">Keep me signed in</label>
            </div>
            <input class="primary_button" type="submit" name="submit" value="next">
        </form>
    </div>
`;

export default class LoginForm extends HTMLElement {
    
    constructor() {
        super();
        this.submitButton = null;
        this.onCountrySelected = this.onCountrySelected.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onPhoneChanged = this.onPhoneChanged.bind(this);

        this.appendChild(template.content.cloneNode(true));

        this.form = this.querySelector('form');
        this.form.addEventListener('change', this.onCountrySelected); 
        this.form.addEventListener('submit', this.onSubmit);

        this.$phoneField = this.querySelector('[name="phone"]');
        this.$phoneField.addEventListener('input', this.onPhoneChanged);

        this.submitButton = this.querySelector('[type=submit]');
        this.submitButton.style.display = 'none';

        this._data = {
            phone: undefined
        };
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
            this.$phoneField.prefix = country.prefix;
            this.$phoneField.focus();
        }
    }

    updatePhonePrefix(prefix) {
        this.$phoneField.value = prefix;
    }

    onPhoneChanged(event) {
        console.log(event.target.value)
        const numbers = event.target.value.replace(new RegExp(/[^\d]/, 'g'), '');
        if (numbers.length === 12) {
            this.submitButton.style.display = 'block';
            this._data.phone = numbers;
        }
    }

    onSubmit(event) {
        const {phone} = this._data;

        event.data = {
            phoneNumber: phone,
        };
    }
}

window.customElements.define('login-form', LoginForm);