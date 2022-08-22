import { curry } from 'ramda';

export class Store {
  #value;
  #consumers = new Set();

  constructor(initialValue) {
    this.#value = initialValue;
  }

  get value() {
    return this.#value;
  }

  next(value) {
    this.#value = value;
    this.#consumers.forEach((next) => next(this.#value));
    this.#consumers.clear();
  }

  async *[Symbol.asyncIterator]() {
    yield this.#value;
    while (true) {
      yield await new Promise((res) => this.#consumers.add(res));
    }
  }
}

export const connect = curry(
  (generator, mapStateToProps, clazz) =>
    class extends clazz {
      connectedCallback() {
        Object.keys(mapStateToProps(generator.value)).forEach((key) =>
          Object.defineProperty(this, key, {
            get() {
              return mapStateToProps(generator.value)[key];
            },
            enumerable: true,
          })
        );
        (async () => {
          for await (const _ of generator) {
            this.update();
          }
        })();
        super.connectedCallback();
      }
    }
);
