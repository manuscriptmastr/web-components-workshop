import { html } from 'lit-html';
import { formStore } from '../store/observable.js';
import { connect } from '../utils/observable.js';
import { ReactiveElement } from '../utils/reactive-element.js';

export class Form extends ReactiveElement {
  setOrigin(origin) {
    this.dispatchEvent(
      new CustomEvent('store:form', {
        bubbles: true,
        detail: { origin, roaster: this.roaster },
      })
    );
  }

  setRoaster(roaster) {
    this.dispatchEvent(
      new CustomEvent('store:form', {
        bubbles: true,
        detail: { origin: this.origin, roaster },
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
  connect(formStore, ({ origin, roaster }) => ({ origin, roaster }), Form)
);
