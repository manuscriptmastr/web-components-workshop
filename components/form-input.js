import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { ReactiveElement } from '../utils/reactive-element.js';

export class FormInput extends ReactiveElement {
  static properties = ['label', 'value'];

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
    return html`
      <style>
        label {
          color: var(--color-primary);
        }

        input {
          color: var(--color-secondary);
        }
      </style>
      <label for="${this.id}">${this.label}</label>
      <input
        value="${this.value}"
        id="${this.id}"
        @input="${this.handleInput.bind(this)}"
      />
    `;
  }
}

customElements.define('form-input', FormInput);
