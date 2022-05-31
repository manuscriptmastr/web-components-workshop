import { render } from 'lit-html';
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
    if (this.isConnected) {
      render(this.render(), this.shadowRoot);
    }
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

export const reactiveElement = (props, render) =>
  class extends ReactiveElement {
    static properties = props;

    render() {
      let count = -1;
      const useState = (initialValue) => {
        count++;
        const key = count;
        if (!this.state.hasOwnProperty(key)) {
          reactiveProperty(
            this.state,
            key,
            initialValue,
            this.update.bind(this)
          );
        }
        return [this.state[key], (newValue) => (this.state[key] = newValue)];
      };

      return render({ ...this, host: this, useState });
    }
  };
