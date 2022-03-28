export class FormInput extends HTMLElement {
  static observedAttributes = ['label', 'value'];

  get label() {
    return this.getAttribute('label');
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(val) {
    this.setAttribute('value', val);
  }

  get id() {
    return this.label.toLowerCase();
  }

  handleInput(event) {
    this.value = event.target.value;
  }

  _attachListeners() {
    this.querySelector('input')?.addEventListener(
      'input',
      this.handleInput.bind(this)
    );
  }

  _removeListeners() {
    this.querySelector('input')?.removeEventListener(
      'input',
      this.handleInput.bind(this)
    );
  }

  _render() {
    this.innerHTML = `
      <style>
        label {
          color: blue;
        }

        input {
          color: green;
        }
      </style>
      <label for="${this.id}">${this.label}</label>
      <input value="${this.value}" id="${this.id}" />
    `;
  }

  connectedCallback() {
    this._render();
    this._attachListeners();
  }

  attributeChangedCallback(key, prev, curr) {
    if (prev !== curr) {
      this._removeListeners();
      this._render();
      this._attachListeners();
    }
  }

  disconnectedCallback() {
    this._removeListeners();
  }
}

customElements.define('form-input', FormInput);
