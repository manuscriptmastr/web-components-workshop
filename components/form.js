import { ReactiveElement } from '../utils/reactive-element.js';

export class Form extends ReactiveElement {
  state = {
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
    this.shadowRoot.innerHTML = `
			<form>
				<form-input label="Origin" value="${this.state.origin}"></form-input>
			</form>
		`;
  }
}

customElements.define('app-form', Form);
