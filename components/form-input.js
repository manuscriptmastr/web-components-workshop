export class FormInput extends HTMLElement {
  constructor() {
    super();
    const label = this.getAttribute('label');
    const value = this.getAttribute('value');
    const id = label.toLowerCase();
    this.innerHTML = `
      <style>
        label {
          color: blue;
        }

        input {
          color: green;
        }
      </style>
      <label for="${id}">${label}</label>
      <input value="${value}" id="${id}" />
    `;
  }
}

customElements.define('form-input', FormInput);
