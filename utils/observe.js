import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';

const unsubscribe = Symbol('unsubscribeObservedValues');
/**
 * observe(FormState, mapStateToProps)(Form)
 */
export const observe = curry(
  (observable, mapStateToProps, superclass) =>
    class extends superclass {
      constructor() {
        super();
        const self = this;
        Object.keys(mapStateToProps(observable.getValue())).forEach((key) => {
          Object.defineProperty(self, key, {
            get() {
              return mapStateToProps(observable.getValue())[key];
            },
          });
        });
      }

      connectedCallback() {
        this[unsubscribe] = observable.subscribe(this.update.bind(this));
        super.connectedCallback();
      }

      disconnectedCallback() {
        this[unsubscribe]();
        super.disconnectedCallback();
      }
    }
);
