export class FormInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const label = this.getAttribute('label');
    const value = this.getAttribute('value');
    const id = label.toLowerCase();

    this.shadowRoot.innerHTML = `
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
}

customElements.define('form-input', FormInput);
