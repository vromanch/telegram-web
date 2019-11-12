const template = document.createElement('template');
template.innerHTML = `
    <div class="code_form">
        <h1></h1>
    </div>
`;

export default class CodeForm extends HTMLElement {
    constructor() {
        super();
        
        this.appendChild(template.content.cloneNode(true));

        this.$h1 = this.querySelector('h1');
    }

    set phoneNumber(phoneNumber) {
        this._phoneNumber = phoneNumber;
    }

    connectedCallback() {
        this.$h1.innerHTML = this._phoneNumber;
    }
}

window.customElements.define('code-form', CodeForm);