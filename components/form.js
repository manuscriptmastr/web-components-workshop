import { ReactiveElement } from '../utils/reactive-element.js';

class Form extends ReactiveElement {
  static state = {
    origin: 'Worka, Ethiopia',
  };

  listeners = [
    {
      selector: 'form-input',
      event: 'input',
      handler: this.handleInput.bind(this),
    },
  ];

  handleInput(event) {
    this.state.origin = event.detail;
  }

  render() {
    return `<form><form-input label="Origin" value="${this.state.origin}"></form-input></form>`;
  }
}

customElements.define('app-form', Form);
