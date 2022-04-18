export class FormInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  get label() {
    return this.getAttribute('label');
  }

  get value() {
    return this.getAttribute('value');
  }

  get id() {
    return this.label.toLowerCase();
  }

  handleInput(event) {
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('input', { detail: event.target.value })
    );
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        label {
          color: var(--color-primary);
        }

        input {
          color: var(--color-secondary);
        }
      </style>
      <label for="${this.id}">${this.label}</label>
      <input value="${this.value}" id="${this.id}" />
    `;

    this.shadowRoot
      .querySelector('input')
      .addEventListener('input', this.handleInput.bind(this));
  }
}

customElements.define('form-input', FormInput);
