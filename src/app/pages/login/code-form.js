import '@lottiefiles/lottie-player';

const template = document.createElement('template');
template.innerHTML = `
    <div class="code_form">
        <lottie-player
            autoplay
            mode="normal"
            src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
            style="width: 320px"
        >
        </lottie-player>
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