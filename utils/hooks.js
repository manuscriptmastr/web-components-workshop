import { equals } from 'https://unpkg.com/ramda@0.28.0/es/index.js';

export const Hooks = new (class {
  elements = new Map();

  _elementKey;
  _hookKey;

  get currentElement() {
    return this.elements.get(this._elementKey);
  }

  get currentHook() {
    return this.elements.get(this._elementKey).hooks.get(this._hookKey);
  }

  createHook() {
    this._hookKey++;
    if (!this.currentHook) {
      this.currentElement.hooks.set(this._hookKey, { uid: this._hookKey });
    }
    return this.currentHook;
  }

  setElement(element, hooks = new Map()) {
    this.elements.set(element._uid, { element, hooks });
  }

  removeElement(element) {
    const { hooks } = this.elements.get(element._uid);
    for (const [_, { cleanup = () => {} }] of hooks) {
      cleanup();
    }
    this.elements.delete(element._uid);
  }

  focusElement(element) {
    this._elementKey = element._uid;
    this._hookKey = -1;
  }

  unfocusElement() {
    this._elementKey = undefined;
    this._hookKey = undefined;
  }
})();

export const useState = (initialValue) => {
  const { uid } = Hooks.createHook();
  const { element } = Hooks.currentElement;
  if (!element.state.hasOwnProperty(uid)) {
    element.constructor.createState(element, uid, initialValue);
  }
  return [element.state[uid], (newValue) => (element.state[uid] = newValue)];
};

export const useEffect = (fn, deps) => {
  const hook = Hooks.createHook();
  const { cleanup, deps: prevDeps } = hook;
  const dependenciesMatch = (prev, curr) =>
    Array.isArray(curr) && equals(prev, curr);

  hook.deps = deps;

  if (!dependenciesMatch(prevDeps, deps) && typeof cleanup === 'function') {
    cleanup();
  }

  if (!cleanup || !dependenciesMatch(prevDeps, deps)) {
    // defer until after render()
    setTimeout(() => {
      const cleanup = fn();
      hook.cleanup = typeof cleanup === 'function' ? cleanup : () => {};
    }, 0);
  }
};
