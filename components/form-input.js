import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { reactiveElement } from '../utils/reactive-element.js';

const handleInput = (event, host) => {
  event.stopPropagation();
  host.dispatchEvent(new CustomEvent('input', { detail: event.target.value }));
};

export const FormInput = reactiveElement(
  'form-input',
  ['label', 'value'],
  ({ label, value, useEffect, host }) => {
    useEffect(() => {
      console.log('Connecting <form-input>');
      return () => {
        console.log('Disconnecting <form-input>');
      };
    }, []);
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
