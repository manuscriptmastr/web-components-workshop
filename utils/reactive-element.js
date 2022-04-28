import { render } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { pick } from 'https://unpkg.com/ramda@0.28.0/es/index.js';

export class ReactiveElement extends HTMLElement {
  static reactiveProperty = (object, key, initialValue, notify = () => {}) => {
    object[`_${key}`] = initialValue;
    Object.defineProperty(object, key, {
      get() {
        return object[`_${key}`];
      },
      set(newValue) {
        const oldValue = object[`_${key}`];
        object[`_${key}`] = newValue;
        notify(key, oldValue, newValue);
      },
    });
  };

  static reflectiveProperty = (object, key) => {
    Object.defineProperty(object, key, {
      get() {
        return object.getAttribute(key);
      },
    });
  };

  static get observedAttributes() {
    return this.properties || [];
  }

  state = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.constructor.observedAttributes.forEach((key) =>
      ReactiveElement.reflectiveProperty(this, key)
    );
  }

  update() {
    render(this.render(), this.shadowRoot);
  }

  connectedCallback() {
    Object.entries(this.state).forEach(([key, value]) =>
      ReactiveElement.reactiveProperty(
        this.state,
        key,
        value,
        this.update.bind(this)
      )
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
        const key = `${this.tagName.toLowerCase()}:hook:${count}`;
        if (!this.state.hasOwnProperty(key)) {
          ReactiveElement.reactiveProperty(
            this.state,
            key,
            initialValue,
            this.update.bind(this)
          );
        }
        return [this.state[key], (newValue) => (this.state[key] = newValue)];
      };

      return render({ host: this, ...pick(props, this), useState });
    }
  };
