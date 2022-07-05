import { equals } from 'ramda';
import { reactiveProperty } from './reactive-property.js';

export const Hooks = new (class {
  elements = new Map();

  currentElement;
  hookKey = undefined;

  findOrCreateHook(initialHook = {}) {
    this.hookKey++;
    const hooks = this.elements.get(this.currentElement);

    const hook = Array.from(hooks).hasOwnProperty(this.hookKey)
      ? Array.from(hooks)[this.hookKey]
      : {
          ...initialHook,
          uid: `${this.currentElement.tagName.toLowerCase()}:hook:${
            this.hookKey
          }`,
        };

    hooks.add(hook);
    return hook;
  }

  setElement(element, hooks = new Set()) {
    this.elements.set(element, hooks);
  }

  removeElement(element) {
    const hooks = this.elements.get(element);
    for (const { cleanup = () => {} } of hooks) {
      cleanup();
    }
    this.elements.delete(element);
  }

  focusElement(element) {
    this.currentElement = element;
    this.hookKey = -1;
  }

  unfocusElement() {
    this.currentElement = undefined;
    this.hookKey = undefined;
  }
})();

export const useState = (initialValue) => {
  const { uid } = Hooks.findOrCreateHook();
  const element = Hooks.currentElement;
  if (!element.state.hasOwnProperty(uid)) {
    reactiveProperty(
      element.state,
      uid,
      initialValue,
      element.update.bind(element)
    );
  }
  return [element.state[uid], (newValue) => (element.state[uid] = newValue)];
};

export const useEffect = (fn, deps) => {
  const hook = Hooks.findOrCreateHook({ deps });
  const dependenciesMatch = (prev, curr) =>
    Array.isArray(curr) && equals(prev, curr);
  const hasCleanup = (hook) => typeof hook.cleanup === 'function';

  if (!dependenciesMatch(hook.deps, deps) && hasCleanup(hook)) {
    hook.cleanup();
  }

  // If this is the first time running the hook or dependencies have changed
  if (!dependenciesMatch(hook.deps, deps) || !hasCleanup(hook)) {
    // defer until after render()
    setTimeout(() => {
      const cleanup = fn();
      hook.cleanup = typeof cleanup === 'function' ? cleanup : () => {};
      hook.deps = deps;
    }, 0);
  }
};

export const useContext = (tagName) => {
  const element = Hooks.currentElement;
  const provider = element.closest(tagName);
  return [
    provider.state,
    (newState) =>
      Object.entries(newState).forEach(
        ([key, value]) => (provider.state[key] = value)
      ),
  ];
};
