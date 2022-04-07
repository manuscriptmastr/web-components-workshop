import { render } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { equals, pick } from 'https://unpkg.com/ramda@0.28.0/es/index.js';

const Counter = () => {
  let count = -1;
  return () => {
    count++;
    return count;
  };
};

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

export const reactiveElement = (tag, props, renderFn) => {
  const Element = class extends HTMLElement {
    static observedAttributes = props;

    state = {};

    effectsQueue = new EffectsQueue();

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._setupProperties();
    }

    _setupProperties() {
      const self = this;
      self.constructor.observedAttributes.forEach((attribute) => {
        Object.defineProperty(self, attribute, {
          get() {
            return self.getAttribute(attribute);
          },
        });
      });
    }

    _queueEffect(key, effect, dependencies) {
      this.effectsQueue.set(key, effect, dependencies);
    }

    _render() {
      const counter = Counter();
      const useState = (initialValue) => {
        const self = this;
        const key = counter();

        if (!self.state[`_${key}`]) {
          self.state[`_${key}`] = initialValue;
          Object.defineProperty(self.state, key, {
            get() {
              return self.state[`_${key}`];
            },
            set(newValue) {
              const oldValue = self.state[`_${key}`];
              self.state[`_${key}`] = newValue;
              self.attributeChangedCallback(key, oldValue, newValue);
            },
          });
        }

        return [
          self.state[key],
          (value) => {
            self.state[key] = value;
          },
        ];
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
    }

    connectedCallback() {
      this._connected = true;
      this._render();
      this.effectsQueue.start();
    }

    attributeChangedCallback(key, prev, curr) {
      if (prev !== curr && this._connected) {
        this._render();
        this.effectsQueue.start();
      }
    }

    disconnectedCallback() {
      this.effectsQueue.stop();
      this._connected = false;
    }
  };

  customElements.define(tag, Element);
};
