import { paramCase } from 'change-case';
import { render } from 'lit-html';

export class ReactiveElement extends HTMLElement {
  static observedAttributes = [];
  static properties = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    Object.entries(this.constructor.properties).forEach(
      ([key, { type, default: def }]) =>
        Object.defineProperty(this, key, {
          get() {
            return type(this.getAttribute(paramCase(key)) ?? def);
          },
        })
    );
  }

  update() {
    if (this.isConnected) {
      render(this.render(), this.shadowRoot);
    }
  }

  connectedCallback() {
    this.update();
  }

  attributeChangedCallback(key, prev, curr) {
    if (prev !== curr) {
      this.update();
    }
  }

  disconnectedCallback() {}
}
