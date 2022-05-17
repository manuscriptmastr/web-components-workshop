const UPDATE_KEY = Symbol('update');
const FORK_KEY = Symbol('fork');
import { curry } from 'ramda';

// const createStore = (initialValue) => {
//   let resolve = () => Promise.resolve(value);
//   const store = (async function* () {
//     yield initialValue;
//     while (true) {
//       yield await new Promise((res) => (resolve = res));
//     }
//   })();
//   store[UPDATE_KEY] = (newValue) => resolve(newValue);
//   return store;
// };

// const Store = createStore(0);

// (async () => {
//   for await (const value of Store) {
//     console.log(`${value} bananas!`);
//   }
// })();

// const fork = (store) => {};
// const update = (value, store) => store[UPDATE_KEY](value);

// fork(Store);
// update(1, Store);

// const from = async function*(observable) {
// 	yield observable.getValue()
// 	observable.subscribe(value => yield value)
// 	return await new Promise(res => observable.complete(res))
// }

export const consume = curry(
  (generator, superclass) =>
    class extends superclass {
      connectedCallback() {
        // Object.entries(initialState).forEach(([key, value]) =>
        //   Object.defineProperty(this, key, {
        //     value,
        //     enumerable: true,
        //     writable: true,
        //   })
        // );
        (async () => {
          let first = true;
          for await (const update of generator()) {
            Object.entries(update).forEach(([key, value]) => {
              if (first) {
                Object.defineProperty(this, key, {
                  value,
                  enumerable: true,
                });
              } else {
                Object.getOwnPropertyDescriptor(this, key).value = value;
              }
            });
            first = false;
            this.update();
          }
        })();
        super.connectedCallback();
      }
    }
);
