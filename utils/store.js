import { curry } from 'ramda';

export const createConnect = curry(
  (store, mapStateToProps, clazz) =>
    class extends clazz {
      connectedCallback() {
        Object.keys(mapStateToProps(store.getState())).forEach((key) =>
          Object.defineProperty(this, key, {
            get() {
              return mapStateToProps(store.getState())[key];
            },
          })
        );
        super.connectedCallback();
        this.unsubscribeFromStore = store.subscribe(this.update.bind(this));
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribeFromStore();
      }
    }
);
