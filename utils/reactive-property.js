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
      const oldValue = object[`_${key}`];
      object[`_${key}`] = newValue;
      notify(key, oldValue, newValue);
    },
    enumerable: true,
  });
};

export const reflectiveProperty = (object, key) => {
  Object.defineProperty(object, key, {
    get() {
      return object.getAttribute(key);
    },
    enumerable: true,
  });
};
