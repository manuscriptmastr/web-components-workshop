import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';

export const persist = curry((storage, observable) => {
  if (storage.getItem(observable) !== null) {
    observable.next(JSON.parse(storage.getItem(observable)));
  }
  observable.subscribe((value) =>
    storage.setItem(observable, JSON.stringify(value))
  );
  return observable;
});
