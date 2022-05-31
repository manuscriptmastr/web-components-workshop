import { html } from 'lit-html';
import { reactiveElement } from '../utils/reactive-element.js';

export const FormInput = reactiveElement(
  ['label', 'value'],
  ({ label, value, host }) => {
    const id = label.toLowerCase();
    const handleInput = (event) => {
      event.stopPropagation();
      host.dispatchEvent(
        new CustomEvent('input', { detail: event.target.value })
      );
    };

    return html`
      <style>
        label {
          color: var(--color-primary);
        }

        input {
          color: var(--color-secondary);
        }
      </style>
      <label for="${id}">${label}</label>
      <input value="${value}" id="${id}" @input="${handleInput}" />
    `;
  }
);

customElements.define('form-input', FormInput);
