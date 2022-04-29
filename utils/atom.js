/**
 * const FormState = atom({ origin: '', roaster: '' })
 * const unsubscribe = FormState.subscribe(console.log)
 * unsubscribe()
 */
export const atom = (initialValue) => {
  let VALUE = Object.freeze(initialValue);
  const subscribers = new Set();

  return {
    getValue: () => VALUE,
    subscribe: (fn) => {
      subscribers.add(fn);
      return () => {
        subscribers.delete(fn);
      };
    },
    update: (resolver) => {
      const newValue =
        typeof resolver === 'function' ? resolver(VALUE) : resolver;
      VALUE = Object.freeze(newValue);
      for (const notify of subscribers) {
        notify(VALUE);
      }
    },
  };
};
