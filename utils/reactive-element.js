export class ReactiveElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setupState() {
    const self = this;
    Object.entries(self.state ?? {}).forEach(([key, value]) => {
      self.state[`_${key}`] = value;
      Object.defineProperty(self.state, key, {
        get() {
          return self.state[`_${key}`];
        },
        set(newValue) {
          const oldValue = self.state[`_${key}`];
          self.state[`_${key}`] = newValue;
          self.attributeChangedCallback(key, oldValue, newValue);
        },
      });
    });
  }

  listen() {
    this._listeners = this._listeners ?? [];
    this.listeners?.forEach(({ selector, event, handler }) => {
      this.shadowRoot.querySelector(selector)?.addEventListener(event, handler);
      this._listeners.push(() =>
        this.shadowRoot
          .querySelector(selector)
          ?.removeEventListener(event, handler)
      );
    });
  }

  unlisten() {
    this._listeners = this._listeners ?? [];
    this._listeners.forEach((removeListener) => removeListener());
  }

  connectedCallback() {
    this._connected = true;
    this.setupState();
    this.render();
    this.unlisten();
    this.listen();
  }

  attributeChangedCallback(key, prev, curr) {
    if (prev !== curr && this._connected) {
      this.render();
      this.unlisten();
      this.listen();
    }
  }

  disconnectedCallback() {
    this.unlisten();
    this._connected = false;
  }
}
