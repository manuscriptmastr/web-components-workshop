import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';

export const persist = curry(({ storage = localStorage, key }, observable) => {
  if (storage.getItem(key) !== null) {
    observable.update(JSON.parse(storage.getItem(key)));
  }
  observable.subscribe((value) => storage.setItem(key, JSON.stringify(value)));
  return observable;
});
