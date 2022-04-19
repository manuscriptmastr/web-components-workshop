export const Hooks = new (class {
  elements = new Map();

  _elementKey;
  _hookKey;

  get currentElement() {
    if (
      this._elementKey === undefined ||
      !this.elements.has(this._elementKey)
    ) {
      throw new Error('Hooks must be called inside your render function.');
    }
    return this.elements.get(this._elementKey);
  }

  next() {
    this._hookKey++;
    return this._hookKey;
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
  const HOOK_KEY = Hooks.next();
  const { element, hooks } = Hooks.currentElement;
  if (!element.state.hasOwnProperty(HOOK_KEY)) {
    element.constructor.createState(element, HOOK_KEY, initialValue);
    hooks.set(HOOK_KEY, {});
    Hooks.setElement(element, hooks.set(HOOK_KEY, hooks));
  }
  return [
    element.state[HOOK_KEY],
    (newValue) => (element.state[HOOK_KEY] = newValue),
  ];
};

export const useEffect = (fn) => {
  const HOOK_KEY = Hooks.next();
  const { element, hooks } = Hooks.currentElement;
  if (typeof hooks.get(HOOK_KEY)?.cleanup === 'function') {
    hooks.get(HOOK_KEY).cleanup();
  }

  hooks.set(HOOK_KEY, {});
  Hooks.setElement(element, hooks);

  // defer until after render()
  setTimeout(() => {
    const cleanup = fn();
    hooks.set(HOOK_KEY, { cleanup });
    Hooks.setElement(element, hooks);
  }, 0);
};
