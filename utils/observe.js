import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';
/**
 * observe(FormState, mapStateToProps, mapUpdateToProps)(Form)
 */
export const observe = curry(
  (observable, mapStateToProps, mapUpdateToProps, superclass) => {
    const subscription = Symbol('subscription');

    return class extends superclass {
      constructor() {
        super();
        const self = this;
        Object.keys(mapStateToProps(observable.getValue())).forEach((key) =>
          Object.defineProperty(self, key, {
            get() {
              return mapStateToProps(observable.getValue())[key];
            },
            enumerable: true,
          })
        );

        const update = (valueOrFn) =>
          typeof valueOrFn === 'function'
            ? observable.next(valueOrFn(observable.getValue()))
            : observable.next(valueOrFn);

        Object.entries(mapUpdateToProps(update)).forEach(([key, updater]) =>
          Object.defineProperty(self, key, {
            value: updater,
            enumerable: true,
            writable: false,
          })
        );
      }

      connectedCallback() {
        this[subscription] = observable.subscribe(this.update.bind(this));
        super.connectedCallback();
      }

      disconnectedCallback() {
        this[subscription].unsubscribe();
        super.disconnectedCallback();
      }
    };
  }
);
