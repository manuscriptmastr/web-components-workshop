import { render } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { pick } from 'https://unpkg.com/ramda@0.28.0/es/index.js';
import { Hooks } from './hooks.js';
import { reactiveProperty, reflectiveProperty } from './reactive-property.js';

export class ReactiveElement extends HTMLElement {
  static get observedAttributes() {
    return this.properties || [];
  }

  state = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.constructor.observedAttributes.forEach((key) =>
      reflectiveProperty(this, key)
    );
  }

  update() {
    render(this.render(), this.shadowRoot);
  }

  connectedCallback() {
    this._connected = true;
    Object.entries(this.state).forEach(([key, value]) =>
      reactiveProperty(this.state, key, value, this.update.bind(this))
    );
    this.update();
  }

  attributeChangedCallback(key, prev, curr) {
    if (prev !== curr && this._connected) {
      this.update();
    }
  }

  disconnectedCallback() {
    this._connected = false;
  }
}

export const reactiveElement = (props, render) =>
  class extends ReactiveElement {
    static properties = props;

    render() {
      return render({ host: this, ...pick(props, this) });
    }

    update() {
      Hooks.focusElement(this);
      super.update();
      Hooks.unfocusElement(this);
    }

    connectedCallback() {
      Hooks.setElement(this);
      super.connectedCallback();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      Hooks.removeElement(this);
    }
  };
