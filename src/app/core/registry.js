export default class Registry {
    static register(components) {
        components.forEach(component => {
            window.customElements.define(component.tagName, component.component);
        });
    }
}
