import { paramCase } from 'change-case';

export const customElement =
  (tagName) =>
  (clazz, { addInitializer }) => {
    addInitializer(() => customElements.define(tagName, clazz));
    return clazz;
  };

export const state =
  () =>
  ({ get, set }) => {
    return {
      get() {
        return get.call(this);
      },
      set(value) {
        setTimeout(this.update.bind(this), 0);
        return set.call(this, value);
      },
      init(value) {
        return value;
      },
    };
  };

export const attribute =
  ({ type = String } = {}) =>
  (_, { name }) =>
    function (initialValue) {
      this.observedAttributes = [...this.observedAttributes, paramCase(name)];
      this.properties = {
        ...this.properties,
        [name]: { type, default: initialValue },
      };
    };
