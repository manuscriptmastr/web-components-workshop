import { reactiveElement } from '../utils/reactive-element.js';

const handleInput = (event, host) => {
  event.stopPropagation();
  host.dispatchEvent(new CustomEvent('input', { detail: event.target.value }));
};

export const FormInput = reactiveElement(
  'form-input',
  ['label', 'value'],
  ({ label, value, useEventListener }) => {
    useEventListener('input', 'input', handleInput);
    const id = label.toLowerCase();
    return `
      <style>
        label {
          color: var(--color-primary);
        }

        input {
          color: var(--color-secondary);
        }
      </style>
      <label for="${id}">${label}</label>
      <input value="${value}" id="${id}" />
	`;
  }
);
