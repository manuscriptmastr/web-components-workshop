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
      this.constructor.observedAttributes.forEach((attribute) => {
        Object.defineProperty(this, attribute, {
          get() {
            return this.getAttribute(attribute);
          },
        });
      });
    }

    queueEffect(key, effect, dependencies) {
      this.effectsQueue.set(key, effect, dependencies);
    }

    connectedCallback() {
      this.render();
      this.effectsQueue.start();
    }

    attributeChangedCallback(key, prev, curr) {
      if (prev !== curr) {
        this.render();
        this.effectsQueue.start();
      }
    }

    disconnectedCallback() {
      this.effectsQueue.stop();
    }

    render() {
      const counter = Counter();
      const useState = (initialValue) => {
        const self = this;
        const key = counter();
        const _key = `_${key}`;

        if (!self.state[_key]) {
          self.state[_key] = initialValue;
          Object.defineProperty(self.state, key, {
            get() {
              return self.state[_key];
            },
            set(value) {
              const oldValue = self.state[_key];
              self.state[_key] = value;
              self.attributeChangedCallback(key, oldValue, value);
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
        this.queueEffect(counter(), effect, dependencies);
      const useEventListener = (selector, event, handler) =>
        this.queueEffect(counter(), () => {
          this.shadowRoot
            .querySelector(selector)
            ?.addEventListener(event, (e) => handler(e, this));
          return () =>
            this.shadowRoot
              .querySelector(selector)
              ?.removeEventListener(event, (e) => handler(e, this));
        });

      this.shadowRoot.innerHTML = renderFn({
        ...pick(props, this),
        useEffect,
        useEventListener,
        useState,
      });
    }
  };

  customElements.define(tag, Element);
};
