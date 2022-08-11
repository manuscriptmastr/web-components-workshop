export class Store {
  #value;
  #resolve;

  constructor(initialValue) {
    this.#value = initialValue;
    this.#resolve = () => Promise.resolve(this.#value);
  }

  get value() {
    return this.#value;
  }

  next(value) {
    this.#resolve(value);
  }

  #next() {
    return new Promise((res) => {
      const resolve = (value) => {
        this.#value = value;
        res(value);
      };
      this.#resolve = resolve;
    });
  }

  async *[Symbol.asyncIterator]() {
    yield this.#value;
    while (true) {
      await this.#next();
      yield this.#value;
    }
  }
}

window.Store = Store;
