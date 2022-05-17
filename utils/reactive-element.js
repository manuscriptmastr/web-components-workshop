import { render } from 'lit-html';
import { Hooks } from './hooks.js';
import { reactiveProperty, reflectiveProperty } from './reactive-property.js';

const connected = Symbol('connected');

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
  [connected] = false;

  update() {
    if (this[connected]) {
      render(this.render(), this.shadowRoot);
    }
  }

  connectedCallback() {
    this[connected] = true;
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

  disconnectedCallback() {
    this[connected] = false;
  }
}

export const reactiveElement = (props, render) =>
  class extends ReactiveElement {
    static properties = props;

    render() {
      return render({ ...this, host: this });
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
