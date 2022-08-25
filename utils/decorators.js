export const customElement =
  (tagName) =>
  (clazz, { addInitializer }) =>
    addInitializer(() => customElements.define(tagName, clazz));

export const generator = (key, gen) => (clazz) =>
  class extends clazz {
    [key] = gen;

    connectedCallback() {
      (async () => {
        for await (const _ of gen) {
          this.update();
        }
      })();
      super.connectedCallback();
    }
  };
