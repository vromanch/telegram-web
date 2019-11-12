import {COUNTRIES} from '../../constants/countries';
import {LABEL} from './constants';

import '../drop-down';
import CountryLine from '../country-line';


const template = document.createElement('template');
template.innerHTML = `
<div class="country_field">
    <form-field label="${LABEL}" autocomplete="off"></form-field>
    <i class="caret"></i>
    <drop-down>
        <ul class="countries">
            ${COUNTRIES.map(({code}) => `
                    <country-line code="${code}"></country-line>
                `
            ).join('')}
        </ul>
    </drop-down>
</div>
`;

import './index.scss';

export default class CountryField extends HTMLElement {
    constructor() {
        super();

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onCountrySelected = this.onCountrySelected.bind(this);
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));

        this.$wrapper = this.querySelector('.country_field');
        this.$fieldNode = this.querySelector('form-field');
        this.$fieldNode.addEventListener('click', this.open);
        this.$fieldNode.setAttribute('name', this.getAttribute('name'));
        this.$dropDown = this.querySelector('drop-down');
        
        const ul = this.$dropDown.querySelector('ul');
        ul.addEventListener('click', this.onCountrySelected);

        // hide popup if clicked outside
        document.addEventListener('click', this.close);
    }

    onCountrySelected(event) {
        let countryLine = event.path.filter(element => element instanceof CountryLine);
        if (countryLine[0]) {
            countryLine = countryLine[0];
            const code = countryLine.getAttribute('code');
            const country = COUNTRIES.filter(country => country.code === code);

            if (code) {
                this.$fieldNode.value = country[0].name
                this.setAttribute('code', code);
                this.dispatchEvent(new Event('change', {bubbles: true}));
            }
        }

        this.close();
    }

    close(code) {
        this.$dropDown.open = false;
        this.$wrapper.classList.remove('open');
    }

    disconnectedCallback() {
        this.document.removeEventListener('click', this.close);
        this.$dropDown.removeEventListener('click', this.close);
    }

    open(event) {
        event.stopPropagation();

        this.$dropDown.open = true;
        this.$wrapper.classList.add('open');

        // fix caret click without no focus
        if (!this.$fieldNode.focused) {
            this.$fieldNode.focus();
        }
    }
}

window.customElements.define('country-field', CountryField);