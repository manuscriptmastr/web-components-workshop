import { html } from 'lit-html';
import { ReactiveElement } from '../utils/reactive-element.js';

export class Form extends ReactiveElement {
  state = {
    origin: 'Worka, Ethiopia',
  };

  handleInput(event) {
    this.state.origin = event.detail;
  }

  render() {
    return html`
      <form>
        <form-input
          label="Origin"
          value="${this.state.origin}"
          @input="${this.handleInput.bind(this)}"
        ></form-input>
      </form>
    `;
  }
}

customElements.define('app-form', Form);
