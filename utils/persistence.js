import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';

export const persist = curry((storage, observable) => {
  const { key, subscribe, update } = observable;
  if (storage.getItem(key) !== null) {
    update(JSON.parse(storage.getItem(key)));
  }
  subscribe((value) => storage.setItem(key, JSON.stringify(value)));
  return observable;
});
