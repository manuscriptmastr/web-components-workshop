import { ReactiveElement } from '../utils/reactive-element.js';

export class FormInput extends ReactiveElement {
  static properties = ['label', 'value'];

  static styles = `
    label {
      color: blue;
    }

    input {
      color: green;
    }
  `;

  get id() {
    return this.label.toLowerCase();
  }

  listeners = [
    { selector: 'input', event: 'input', handler: this.handleInput.bind(this) },
  ];

  handleInput(event) {
    this.value = event.target.value;
  }

  render() {
    return `<label for="${this.id}">${this.label}</label><input value="${this.value}" id="${this.id}" />`;
  }
}

customElements.define('form-input', FormInput);
