import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';
/**
 * observe(FormState, mapStateToProps)(Form)
 */
export const observe = curry((observable, mapStateToProps, superclass) => {
  const subscription = Symbol('subscription');

  return class extends superclass {
    constructor() {
      super();
      const self = this;
      Object.keys(mapStateToProps(observable.getValue())).forEach((key) => {
        Object.defineProperty(self, key, {
          get() {
            return mapStateToProps(observable.getValue())[key];
          },
          enumerable: true,
        });
      });
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
});
