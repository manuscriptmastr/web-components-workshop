import { html } from 'lit-html';
import { store } from '../store/generator.js';
import { customElement, generator } from '../utils/decorators.js';
import { ReactiveElement } from '../utils/reactive-element.js';

@customElement('app-form')
@generator('formStore', store)
export class Form extends ReactiveElement {
  get origin() {
    return this.formStore.value.origin;
  }

  set origin(origin) {
    this.formStore.next((state) => ({ ...state, origin }));
  }

  get roaster() {
    return this.formStore.value.roaster;
  }

  set roaster(roaster) {
    this.formStore.next((state) => ({ ...state, roaster }));
  }

  render() {
    return html`
      <form>
        <form-input
          label="Origin"
          value="${this.origin}"
          @input="${(event) => (this.origin = event.detail)}"
        ></form-input>
        <form-input
          label="Roaster"
          value="${this.roaster}"
          @input="${(event) => (this.roaster = event.detail)}"
        ></form-input>
      </form>
    `;
  }
}
