const template = document.createElement('template');
template.innerHTML = `
<div class="field">
    <input type="text" name="" id="">
    <label for="country">Phone Number</label>
</div>
`;

import './index.scss';

export default class FormField extends HTMLElement {
    constructor() {
        super();

        this.appendChild(template.content.cloneNode(true));

        // Cache the value of the inputNode
        this.inputNode = this.querySelector('input');
        this.labelNode = this.querySelector('label');

        // Add all properties on text-box to input
        for (let i = 0; i < this.attributes.length; i++) {
            this.inputNode.setAttribute(
                this.attributes[i].nodeName,
                this.attributes[i].nodeValue
            )
        }
    }

    validate (event) {
        console.log('input can be validated')
    }

    get value () {
        return this.inputNode.value
    }

    set value (newValue) {
        this.inputNode.value = newValue
    }

    set label (newLabel) {
        this.labelNode.innerText = newLabel;
    }

    connectedCallback () {
        this.inputNode.addEventListener('change', this.validate);

        // set label
        let label = this.getAttribute('label');
        this.labelNode.innerText = label;
        this.inputNode.placeholder = label;
    }

    disconnectedCallback () {
        this.inputNode.removeEventListener('change', this.validate)
    }

    static get observedAttributes() {
        return ['label', 'value'];
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case 'value':
                this.inputNode.value = newValue
                break;
            case 'label':
                this.labelNode.value = newValue;
                break;
        }
    }
}
