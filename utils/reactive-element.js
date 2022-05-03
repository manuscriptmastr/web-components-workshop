import { render } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { reactiveProperty, reflectiveProperty } from './reactive-property.js';

export class ReactiveElement extends HTMLElement {
  static get observedAttributes() {
    return this.properties ?? [];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.constructor.observedAttributes.forEach((key) =>
      reflectiveProperty(this, key)
    );
  }

  state = {};

  update() {
    render(this.render(), this.shadowRoot);
  }

  connectedCallback() {
    Object.entries(this.state).forEach(([key, value]) =>
      reactiveProperty(this.state, key, value, this.update.bind(this))
    );
    this.update();
  }

  attributeChangedCallback(key, prev, curr) {
    if (prev !== curr) {
      this.update();
    }
  }
}
