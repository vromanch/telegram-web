const template = document.createElement('template');
template.innerHTML = `
<div class="code_page">
    <h1>Code page</h1>
</div>
`;

import './index.scss';

export default class CodePage extends HTMLElement {
    constructor() {
        super();

        this.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return [];
    }

    onSubmit(event) {
        
    }
}
