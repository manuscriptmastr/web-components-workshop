import { ReactiveElement } from '../utils/reactive-element.js';

export class FormInput extends ReactiveElement {
  static observedAttributes = ['label', 'value'];

  listeners = [
    { selector: 'input', event: 'input', handler: this.handleInput.bind(this) },
  ];

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
}

customElements.define('form-input', FormInput);
