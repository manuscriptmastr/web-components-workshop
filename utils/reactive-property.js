export const reactiveProperty = (
  object,
  key,
  initialValue,
  notify = () => {}
) => {
  object[`_${key}`] = initialValue;
  Object.defineProperty(object, key, {
    get() {
      return object[`_${key}`];
    },
    set(newValue) {
      object[`_${key}`] = newValue;
      notify();
    },
  });
};

export const reflectiveProperty = (object, key) => {
  Object.defineProperty(object, key, {
    get() {
      return object.getAttribute(key);
    },
  });
};
