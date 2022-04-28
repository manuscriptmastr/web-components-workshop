import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';
import { reactiveElement } from '../utils/reactive-element.js';

const handleInput = curry((host, event) => {
  event.stopPropagation();
  host.dispatchEvent(new CustomEvent('input', { detail: event.target.value }));
});

export const FormInput = reactiveElement(
  ['label', 'value'],
  ({ label, value, host }) => {
    const id = label.toLowerCase();
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
      <input value="${value}" id="${id}" @input="${handleInput(host)}" />
    `;
  }
);

customElements.define('form-input', FormInput);
