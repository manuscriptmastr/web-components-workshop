let count = 0;

export class FormCheckbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    count++;
    const label = this.getAttribute('label') ?? '';
    const id = `form-checkbox-${count}`;

    this.shadowRoot.innerHTML = `
      <style>
        label {
          color: var(--color-primary);
        }
      </style>
      <label for="${id}"><slot>${label}</slot></label>
      <input type="checkbox" id="${id}" />
    `;
  }
}

customElements.define('form-checkbox', FormCheckbox);
