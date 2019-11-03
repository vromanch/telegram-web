const template = document.createElement('template');
template.innerHTML = `
<div class="login_page">
    <span class="logo"></span>
    <h1>Sign in to Telegram</h1>
    <p>Please confirm your country and enter your phone number.</p>
    <form>
        <input type="text" placeholder="Country">
        <input type="text" placeholder="Phone Number">
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
    }

    static get observerAttributes() {
        return [];
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));

        const submit = this.querySelector('[type=submit');
        submit.addEventListener('click', event => {
            event.preventDefault();
            alert('Next clicked!');
        });
    }
}
