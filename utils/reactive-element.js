import { pick } from 'https://unpkg.com/ramda@0.28.0/es/index.js';

export class ReactiveElement extends HTMLElement {
  static styles = '';

  static get observedAttributes() {
    return this.properties || [];
  }

  static state = {};

  constructor() {
    super();
    // Encapsulate component
    this.attachShadow({ mode: 'open' });
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
    this.shadowRoot.innerHTML = `<style>${
      this.constructor.styles
    }</style>${this.render()}`;
  }

  _attachListeners() {
    this.listeners.forEach(({ selector, event, handler }) =>
      this.shadowRoot.querySelector(selector)?.addEventListener(event, handler)
    );
  }

  _removeListeners() {
    this.listeners.forEach(({ selector, event, handler }) =>
      this.shadowRoot
        .querySelector(selector)
        ?.removeEventListener(event, handler)
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

export const reactiveElement = (tag, props, renderFn) => {
  const Element = class extends ReactiveElement {
    static properties = props;

    _subscribeListeners = [];

    _unsubscribeListeners = [];

    _state = {};

    useState(initialValue, key) {
      const self = this;

      if (!self.state.hasOwnProperty(key)) {
        self._state[key] = initialValue;
        Object.defineProperty(self.state, key, {
          get() {
            return self._state[key];
          },
          set(value) {
            self._state[key] = value;
            self._removeListeners();
            self._render();
            self._attachListeners();
          },
        });
      }

      return [
        self.state[key],
        (value) => {
          self.state[key] = value;
        },
      ];
    }

    useEventListener(selector, event, handler) {
      const subscribe = () =>
        this.shadowRoot
          .querySelector(selector)
          ?.addEventListener(event, (e) => handler(e, this));
      this._subscribeListeners.push(subscribe.bind(this));

      const unsubscribe = () =>
        this.shadowRoot
          .querySelector(selector)
          ?.removeEventListener(event, (e) => handler(e, this));
      this._unsubscribeListeners.push(unsubscribe.bind(this));
    }

    _attachListeners() {
      this._subscribeListeners.forEach((subscribe) => subscribe());
      this._subscribeListeners = [];
    }

    _removeListeners() {
      this._unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
      this._unsubscribeListeners = [];
    }

    _render() {
      let count = 0;
      this.shadowRoot.innerHTML = renderFn({
        ...pick(props, this),
        useEventListener: this.useEventListener.bind(this),
        useState: (initialValue) => {
          count++;
          return this.useState(initialValue, count);
        },
      });
    }
  };

  customElements.define(tag, Element);
};
