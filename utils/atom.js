import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';
/**
 * const FormState = atom('form', { origin: '', roaster: '' })
 * const unsubscribe = FormState.subscribe(console.log)
 * unsubscribe()
 */
export const atom = curry((key, initialValue) => {
  let VALUE = Object.freeze(initialValue);
  const subscribers = new Set();

  return {
    key,
    getValue: () => VALUE,
    subscribe: (fn) => {
      subscribers.add(fn);
      return () => {
        subscribers.delete(fn);
      };
    },
    update: (resolver) => {
      const newValue =
        typeof resolver === 'function' ? resolver(VALUE) : resolver;
      VALUE = Object.freeze(newValue);
      for (const notify of subscribers) {
        notify(VALUE);
      }
    },
  };
});
