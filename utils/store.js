import { curry } from 'ramda';

export const createStore = (initialState) => {
  let state = initialState;
  const subscribers = new Set();

  return {
    getState: () => state,
    subscribe: (fn) => {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    unsubscribe: Symbol('store.unsubscribe'),
    update: (fnOrValue) => {
      state = typeof fnOrValue === 'function' ? fnOrValue(state) : fnOrValue;
      subscribers.forEach((fn) => fn(state));
    },
  };
};

export const createConnect = curry(
  (store, mapStateToProps, superclass) =>
    class extends superclass {
      updateProperties(state) {
        Object.entries(mapStateToProps(state)).forEach(([key, value]) =>
          Object.defineProperty(this, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: false,
          })
        );
      }

      connectedCallback() {
        this.updateProperties(store.getState());
        super.connectedCallback();
        this[store.unsubscribe] = store.subscribe((state) => {
          this.updateProperties(state);
          this.update();
        });
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this[store.unsubscribe]();
      }
    }
);
