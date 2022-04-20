import { render } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';

export const reactiveProperty = (object, key) => {
  Object.defineProperty(object, key, {
    get() {
      return object.getAttribute(key);
    },
  });
};

export const reactiveState = (object, key, initialValue) => {
  if (!object.state.hasOwnProperty(`_${key}`)) {
    object.state[`_${key}`] = initialValue;
    Object.defineProperty(object.state, key, {
      get() {
        return object.state[`_${key}`];
      },
      set(newValue) {
        const oldValue = object.state[`_${key}`];
        object.state[`_${key}`] = newValue;
        object.attributeChangedCallback(key, oldValue, newValue);
      },
    });
  }
};

export class ReactiveElement extends HTMLElement {
  static get observedAttributes() {
    return this.properties ?? [];
  }

  state = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._setupProperties();
  }

  _setupProperties() {
    this.constructor.observedAttributes.forEach((attr) =>
      reactiveProperty(this, attr)
    );
  }

  _setupState() {
    Object.entries(this.state).forEach(([key, value]) =>
      reactiveState(this, key, value)
    );
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
