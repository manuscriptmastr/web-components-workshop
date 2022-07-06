import { html } from 'lit-html';
import { connect } from '../store/index.js';
import { ReactiveElement } from '../utils/reactive-element.js';

export class Form extends ReactiveElement {
  setOrigin(origin) {
    this.dispatchEvent(
      new CustomEvent('store', {
        bubbles: true,
        detail: { type: 'UPDATE_FORM', payload: { origin } },
      })
    );
  }

  setRoaster(roaster) {
    this.dispatchEvent(
      new CustomEvent('store', {
        bubbles: true,
        detail: { type: 'UPDATE_FORM', payload: { roaster } },
      })
    );
  }

  render() {
    return html`
      <form>
        <form-input
          label="Origin"
          value="${this.origin}"
          @input="${(event) => this.setOrigin(event.detail)}"
        ></form-input>
        <form-input
          label="Roaster"
          value="${this.roaster}"
          @input="${(event) => this.setRoaster(event.detail)}"
        ></form-input>
      </form>
    `;
  }
}

customElements.define(
  'app-form',
  connect(({ origin, roaster }) => ({ origin, roaster }), Form)
);
