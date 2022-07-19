import { curry } from 'ramda';

export const persist = curry((storage, key, observable) => {
  if (storage.getItem(key) !== null) {
    observable.next(JSON.parse(storage.getItem(key)));
  }
  observable.subscribe((value) => storage.setItem(key, JSON.stringify(value)));
  return observable;
});
