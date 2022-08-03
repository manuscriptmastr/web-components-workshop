import { curry } from 'ramda';

export const generator = ({ updateKey = 'update' } = {}) => {
  let resolve = Promise.resolve.bind(Promise);
  const generator = (async function* () {
    while (true) {
      const value = await new Promise((res) => (resolve = res));
      yield value;
    }
  })();
  generator[updateKey] = (val) => resolve(val);
  return generator;
};

export const fork = (() => {
  const generators = new WeakMap();
  return (gen) => {
    const derivedGenerator = generator({ updateKey: 'updateSelf' });
    derivedGenerator.update = gen.update;
    if (!generators.has(gen)) {
      generators.set(gen, new Set());
      async () => {
        for await (const value of gen) {
          for (const derived of generators.get(gen)) {
            derived.updateSelf(value);
          }
        }
      };
    }
    generators.get(gen).add(derivedGenerator);
    return derivedGenerator;
  };
})();

export const update = curry((value, generator) => generator.update(value));

export const map = curry(async function* (fn, generator) {
  for await (const value of generator) {
    yield fn(value);
  }
});

export const forEach = curry(async function* (fn, generator) {
  for await (const value of generator) {
    fn(value);
    yield;
  }
});
