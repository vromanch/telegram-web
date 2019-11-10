import {COUNTRIES} from '../../constants/countries';

const template = document.createElement('template');
template.innerHTML = `
<div class="country-line">
    <i class="flag"></i>
    <span class="name"></span>
    <span class="prefix"></span>
</div>
`;

import './index.scss';

export default class CountryLine extends HTMLElement {
    constructor() {
        super();

        this.appendChild(template.content.cloneNode(true));

        this.flagNode = this.querySelector('.flag');
        this.nameNode = this.querySelector('.name');
        this.prefixNode = this.querySelector('.prefix');
    }

    get code() {
        return this.getAttribute('code');
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const code = this.getAttribute('code');
        if (code) {
            const country = COUNTRIES.find(country => country.code === code);

            this.flagNode.classList.add(`flag_${code}`.toLowerCase());
            this.nameNode.innerText = country.name;
            this.prefixNode.innerText = country.prefix;
        }
    }
}