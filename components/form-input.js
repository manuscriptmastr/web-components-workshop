import { html } from 'lit-html';
import { curry } from 'ramda';
import { ReactiveElement } from '../utils/reactive-element.js';

const FORMAT = {
  max: curry((len, str) => str.slice(0, len)),
  zipcode: (str) => str.replaceAll(/[^\d]/g, '').slice(0, 5),
};

const VALIDATION = {
  max: curry((len, str) => str.length <= len),
  min: curry((len, str) => str.length >= len),
  zipcode: (str) => /^\d{5}$/.test(str),
};

export class FormInput extends ReactiveElement {
  static properties = ['label', 'value', 'type', 'min', 'max'];

  constructor() {
    super();
    const format = FORMAT[this.type] ?? ((i) => i);
    Object.defineProperty(this, 'value', {
      get() {
        return format(this.getAttribute('value'));
      },
      set(value) {
        this.dispatchEvent(new CustomEvent('input', { detail: format(value) }));
      },
    });
  }

  get id() {
    return this.label.toLowerCase();
  }

  format(value) {
    return (FORMAT[this.type] ?? ((i) => i))(value);
  }

  handleInput(event) {
    event.stopPropagation();
    const cursorStart = event.target.selectionStart;
    const cursorEnd = event.target.selectionEnd;
    event.target.value = this.format(event.target.value);
    event.target.setSelectionRange(cursorStart, cursorEnd);
    this.value = event.target.value;
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
