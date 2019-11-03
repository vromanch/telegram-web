const template = document.createElement('template');
template.innerHTML = `
<div class="login_page">
    <span class="logo"></span>
    <h1>Sign in to Telegram</h1>
    <p>Please confirm your country and enter your phone number.</p>
    <form>
        <input type="text" placeholder="Country" name="country">
        <input type="text" placeholder="Phone Number" name="phone">
        <div class="control">
            <input type="checkbox" name="keep-signed">
            <label for="keep-signed">Keep me signed in</label>
        </div>
        <input type="submit" value="Next">
    </form>
</div>
`;

import './index.scss';

export default class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.submitButton = null;
        this.onSubmit = this.onSubmit.bind(this);
    }

    static get observedAttributes() {
        return [];
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));

        this.submitButton = this.querySelector('[type=submit]');
        this.submitButton.addEventListener('click', this.onSubmit);
    }
    attributeChangedCallback() {}
    onSubmit(event) {
        event.preventDefault();
    }
    disconnectedCallback() {
        this.submitButton.removeEventListener('click', this.onSubmit);
    }
}
