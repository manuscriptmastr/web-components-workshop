export class ReactiveElement extends HTMLElement {
  static styles = '';

  static get observedAttributes() {
    return this.properties;
  }

  constructor() {
    super();
    this.constructor.observedAttributes.forEach((attribute) => {
      Object.defineProperty(this, attribute, {
        get() {
          return this.getAttribute(attribute);
        },
        set(value) {
          this.setAttribute(attribute, value);
        },
      });
    });
  }

  listeners = [];

  render() {
    return '';
  }

  _attachListeners() {
    this.listeners.forEach(({ selector, event, handler }) =>
      this.querySelector(selector)?.addEventListener(event, handler)
    );
  }

  _removeListeners() {
    this.listeners.forEach(({ selector, event, handler }) =>
      this.querySelector(selector)?.removeEventListener(event, handler)
    );
  }

  _render() {
    this.innerHTML = `<style>${
      this.constructor.styles
    }</style>${this.render()}`;
  }

  connectedCallback() {
    this._render();
    this._attachListeners();
  }

  attributeChangedCallback(key, prev, curr) {
    if (prev !== curr) {
      this._removeListeners();
      this._render();
      this._attachListeners();
    }
  }

  disconnectedCallback() {
    this._removeListeners();
  }
}
