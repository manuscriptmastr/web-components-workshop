import { render } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { equals, pick } from 'https://unpkg.com/ramda@0.28.0/es/index.js';

export class ReactiveElement extends HTMLElement {
  static get observedAttributes() {
    return this.properties ?? [];
  }

  static createProperty(object, key) {
    Object.defineProperty(object, key, {
      get() {
        return object.getAttribute(key);
      },
    });
  }

  static createState(object, key, initialValue) {
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
  }

  state = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._setupProperties();
  }

  _setupProperties() {
    this.constructor.observedAttributes.forEach((attr) =>
      this.constructor.createProperty(this, attr)
    );
  }

  _setupState() {
    Object.entries(this.state).forEach(([key, value]) =>
      this.constructor.createState(this, key, value)
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

class EffectsQueue {
  queue = new Map();

  get(key) {
    return this.queue.get(key);
  }

  set(key, effect, deps) {
    const { deps: prevDeps, cleanup } = this.queue.get(key) || {};
    this.queue.set(key, { effect, deps, prevDeps, cleanup });
  }

  shouldFire(key) {
    const { deps, prevDeps } = this.queue.get(key);
    return Array.isArray(deps) && equals(deps, prevDeps) ? false : true;
  }

  fire(key) {
    const { effect, ...rest } = this.queue.get(key);
    if (this.shouldFire(key)) {
      const cleanup = effect();
      this.queue.set(key, { effect, ...rest, cleanup });
    }
  }

  cleanup(key, hard = false) {
    const { cleanup } = this.queue.get(key);
    const _cleanup = typeof cleanup === 'function' ? cleanup : () => {};
    if (hard || this.shouldFire(key)) {
      _cleanup();
    }
  }

  start() {
    for (const [key] of this.queue) {
      this.cleanup(key);
    }
    for (const [key] of this.queue) {
      this.fire(key);
    }
  }

  stop() {
    for (const [key] of this.queue) {
      this.cleanup(key, true);
    }
  }
}

const Counter = () => {
  let count = -1;
  return () => {
    count++;
    return count;
  };
};

export const reactiveElement = (tag, props, renderFn) => {
  const Element = class extends ReactiveElement {
    static properties = props;

    effectsQueue = new EffectsQueue();

    _queueEffect(key, effect, dependencies) {
      this.effectsQueue.set(key, effect, dependencies);
    }

    _render() {
      const counter = Counter();
      const useState = (initialValue) => {
        const key = counter();
        this.constructor.createState(this, key, initialValue);
        return [this.state[key], (newValue) => (this.state[key] = newValue)];
      };
      const useEffect = (effect, dependencies) =>
        this._queueEffect(counter(), effect, dependencies);

      render(
        renderFn({
          ...pick(props, this),
          host: this,
          useEffect,
          useState,
        }),
        this.shadowRoot
      );

      this.effectsQueue.start();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.effectsQueue.stop();
    }
  };

  customElements.define(tag, Element);
  return Element;
};
