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
    this.#consumers.forEach((next) => {
      next(this.#value);
    });
    this.#consumers.clear();
  }

  async *[Symbol.asyncIterator]() {
    yield this.#value;
    while (true) {
      yield await new Promise((res) => {
        this.#consumers.add(res);
      });
    }
  }
}

window.Store = Store;
