import { render } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';

export class ReactiveElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  _setupState() {
    const self = this;
    Object.entries(self.state ?? {}).forEach(([key, value]) => {
      self.state[`_${key}`] = value;
      Object.defineProperty(self.state, key, {
        get() {
          return self.state[`_${key}`];
        },
        set(newValue) {
          const oldValue = self.state[`_${key}`];
          self.state[`_${key}`] = newValue;
          self.attributeChangedCallback(key, oldValue, newValue);
        },
      });
    });
  }

  _render() {
    render(this.render(), this.shadowRoot);
  }

  connectedCallback() {
    this._connected = true;
    this._setupState();
    this._render();
  }

  attributeChangedCallback(key, prev, curr) {
    if (prev !== curr && this._connected) {
      this._render();
    }
  }

  disconnectedCallback() {
    this._connected = false;
  }
}
