import { html } from 'lit-html';
import { store } from '../store/index.js';
import { ReactiveElement } from '../utils/reactive-element.js';

export class Store extends ReactiveElement {
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.addEventListener('store', ({ detail: action }) =>
      store.dispatch(action)
    );
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('app-store', Store);
