export class FormInput extends HTMLElement {
  static observedAttributes = ['label', 'value'];

  listeners = [
    { selector: 'input', event: 'input', handler: this.handleInput.bind(this) },
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  get label() {
    return this.getAttribute('label');
  }

  get value() {
    return this.getAttribute('value');
  }

  get id() {
    return this.label.toLowerCase();
  }

  handleInput(event) {
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('input', { detail: event.target.value })
    );
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        label {
          color: var(--color-primary);
        }

        input {
          color: var(--color-secondary);
        }
      </style>
      <label for="${this.id}">${this.label}</label>
      <input value="${this.value}" id="${this.id}" />
    `;
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

customElements.define('form-input', FormInput);
