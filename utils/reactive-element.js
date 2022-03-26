export class ReactiveElement extends HTMLElement {
  static styles = '';

  static get observedAttributes() {
    return this.properties || [];
  }

  static state = {};

  constructor() {
    super();
    // Properties
    this.constructor.observedAttributes.forEach((attribute) => {
      Object.defineProperty(this, attribute, {
        get() {
          return this.getAttribute(attribute);
        },
      });
    });
    // Data
    const STATE = { ...this.constructor.state };
    this.state = {};
    const self = this;
    Object.keys(self.constructor.state).forEach((key) => {
      Object.defineProperty(self.state, key, {
        get() {
          return STATE[key];
        },
        set(value) {
          STATE[key] = value;
          self._removeListeners();
          self._render();
          self._attachListeners();
        },
      });
    });
  }

  listeners = [];

  render() {
    return '';
  }

  _render() {
    this.innerHTML = `<style>${
      this.constructor.styles
    }</style>${this.render()}`;
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
