import { curry } from 'ramda';

export const connect = curry(
  (observable, mapStateToProps, clazz) =>
    class extends clazz {
      connectedCallback() {
        Object.keys(mapStateToProps(observable.value)).forEach((key) =>
          Object.defineProperty(this, key, {
            get() {
              return mapStateToProps(observable.value)[key];
            },
            enumerable: true,
          })
        );
        super.connectedCallback();
        this.subscription = observable.subscribe(this.update.bind(this));
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this.subscription.unsubscribe();
      }
    }
);
