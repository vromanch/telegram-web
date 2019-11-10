const template = document.createElement('template');
template.innerHTML = `
<style>
    .dropdown {
        display: none;
    }
    .content {
        box-shadow: 0px 7px 13px -4px rgba(0, 0, 0, 0.46);
        border-radius: 10px;
    }
</style>
<div class="dropdown">
    <div class="content">
        <slot></slot>
    </div>
</div>
`;

export default class DropDown extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.dropDown = this.shadowRoot.querySelector('.dropdown');
        this.dropDown.addEventListener('click', this.onClick);
    }

    onClick(event) {
        event.stopPropagation();
    }

    disconnectedCallback() {
        this.dropDown.removeEventListener('click', this.onClick);
    }

    static get observedAttributes() {
        return ['open'];
    }

    get open() {
        return this.getAttribute('open') !== undefined;
    }

    set open(isOpen) {
        if (isOpen) {
            this.setAttribute('open', true);
        } else {
            this.removeAttribute('open');
        }
    }

    attributeChangedCallback (name, oldValue, isOpen) {
        switch (name) {
            case 'open':
                if (isOpen) {
                    this.dropDown.style.display = 'block';
                } else {
                    this.dropDown.style.display = 'none';
                }
                break;
        }
    }
}