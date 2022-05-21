import { curry } from 'ramda';

const UPDATE_KEY = Symbol('update');

export const createGenerator = (initialValue) => {
  let curr = initialValue;
  let resolve = (value) => Promise.resolve(value);
  const generator = (async function* () {
    yield await resolve(initialValue);
    while (true) {
      const next = await new Promise((res) => (resolve = res));
      curr = next;
      yield curr;
    }
  })();
  generator.update = (valueOrFn) =>
    resolve(typeof valueOrFn === 'function' ? valueOrFn(curr) : valueOrFn);
  return generator;
};

const childGenerator = () => {
  let resolve = () => Promise.resolve();
  const generator = (async function* () {
    while (true) {
      yield await new Promise((res) => (resolve = res));
    }
  })();
  generator[UPDATE_KEY] = (newValue) => resolve(newValue);
  return generator;
};

export const update = curry((value, generator) => generator.update(value));

export const fork = (() => {
  const generators = new WeakMap();

  return (generator) => {
    const derivedGenerator = childGenerator();
    derivedGenerator.update = generator.update;
    if (!generators.has(generator)) {
      generators.set(generator, new Set());
      (async () => {
        for await (const value of generator) {
          for (const derived of generators.get(generator)) {
            derived[UPDATE_KEY](value);
          }
        }
      })();
    }
    generators.get(generator).add(derivedGenerator);
    return derivedGenerator;
  };
})();

export const withGenerator = curry(
  (generator, mapUpdateToProps, superclass) => {
    const GENERATOR_KEY = Symbol('generator');
    return class extends superclass {
      [GENERATOR_KEY] = fork(generator);

      connectedCallback() {
        super.connectedCallback();
        Object.entries(mapUpdateToProps(this[GENERATOR_KEY].update)).forEach(
          ([key, value]) => {
            Object.defineProperty(this, key, {
              value,
              configurable: true,
              enumerable: true,
              writable: false,
            });
          }
        );
        (async () => {
          for await (const update of this[GENERATOR_KEY]) {
            Object.entries(update).forEach(([key, value]) => {
              Object.defineProperty(this, key, {
                value,
                configurable: true,
                enumerable: true,
                writable: false,
              });
            });
            this.update();
          }
        })();
      }

      disconnectedCallback() {
        this[GENERATOR_KEY].return();
        super.disconnectedCallback();
      }
    };
  }
);
