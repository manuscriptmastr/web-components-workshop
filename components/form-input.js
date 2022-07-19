import { html } from 'lit-html';
import { settingsStore } from '../store/observable.js';
import { useEffect } from '../utils/hooks.js';
import { connect } from '../utils/observable.js';
import { reactiveElement } from '../utils/reactive-element.js';

const handleInput = (event, host) => {
  event.stopPropagation();
  host.dispatchEvent(new CustomEvent('input', { detail: event.target.value }));
};

export const FormInput = reactiveElement(
  ['label', 'value'],
  ({ label, value, inputColor, labelColor, host }) => {
    useEffect(() => {
      console.log('<form-input> mounting effect');
      return () => console.log('<form-input> unmounting effect');
    });
    const id = label.toLowerCase();
    return html`
      <style>
        label {
          color: ${labelColor};
        }

        input {
          color: ${inputColor};
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

customElements.define(
  'form-input',
  connect(
    settingsStore,
    ({ inputColor, labelColor }) => ({ inputColor, labelColor }),
    FormInput
  )
);
