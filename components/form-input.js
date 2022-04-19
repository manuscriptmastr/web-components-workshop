import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { useEffect } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

const handleInput = (event, host) => {
  event.stopPropagation();
  host.dispatchEvent(new CustomEvent('input', { detail: event.target.value }));
};

export const FormInput = reactiveElement(
  ['label', 'value'],
  ({ label, value, host }) => {
    useEffect(() => {
      console.log('<form-input> mounting effect');
      return () => console.log('<form-input> unmounting effect');
    });
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
      <input
        value="${value}"
        id="${id}"
        @input="${(event) => handleInput(event, host)}"
      />
    `;
  }
);

customElements.define('form-input', FormInput);
