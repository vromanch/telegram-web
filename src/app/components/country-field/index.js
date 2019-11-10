import {COUNTRIES} from '../../constants/countries';
import {LABEL} from './constants';
import CountryLine from '../country-line';

const template = document.createElement('template');
template.innerHTML = `
<div class="country-field">
    <form-field label="${LABEL}" autocomplete="off"></form-field>
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

        this.$fieldNode = this.querySelector('form-field');
        this.$fieldNode.addEventListener('click', this.open);
        console.log('country current name ?', this.getAttribute('name'));
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
            }
        }
        this.close();
    }

    close() {
        this.$dropDown.open = false;
    }

    disconnectedCallback() {
        this.document.removeEventListener('click', this.close);
        this.$dropDown.removeEventListener('click', this.close);
    }

    open(event) {
        event.stopPropagation();
        this.$dropDown.open = true;
    }
}