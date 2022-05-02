import { render } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { Hooks } from './hooks.js';
import { reactiveProperty, reflectiveProperty } from './reactive-property.js';

const connected = Symbol('connected');

export class ReactiveElement extends HTMLElement {
  static get observedAttributes() {
    return this.properties || [];
  }

  state = {};

  constructor() {
    super();
    this[connected] = false;
    this.attachShadow({ mode: 'open' });
    this.constructor.observedAttributes.forEach((key) =>
      reflectiveProperty(this, key)
    );
  }

  update() {
    render(this.render(), this.shadowRoot);
  }

  connectedCallback() {
    this[connected] = true;
    Object.entries(this.state).forEach(([key, value]) =>
      reactiveProperty(this.state, key, value, this.update.bind(this))
    );
    this.update();
  }

  attributeChangedCallback(key, prev, curr) {
    if (prev !== curr && this[connected]) {
      this.update();
    }
  }

  disconnectedCallback() {
    this[connected] = false;
  }
}

const getters = (object) =>
  Object.fromEntries(
    Object.entries(Object.getOwnPropertyDescriptors(object))
      .filter(([_, config]) => config.hasOwnProperty('get'))
      .map(([key]) => [key, object[key]])
  );

export const reactiveElement = (props, render) =>
  class extends ReactiveElement {
    static properties = props;

    render() {
      return render({ host: this, ...getters(this) });
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
