import { curry } from 'ramda';

export const createStore = (reducer, initialState) => {
  let state = initialState;
  const subscribers = new Set();

  return {
    getState: () => state,
    subscribe: (fn) => {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    dispatch: (action) => {
      state = reducer(state, action);
      subscribers.forEach((fn) => fn());
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
        this.unsubscribeFromStore = store.subscribe(() => {
          this.updateProperties(store.getState());
          this.update();
        });
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribeFromStore();
      }
    }
);
