import { html } from 'lit-html';
import { store } from '../store/generator.js';
import { settingsStore } from '../store/observable.js';
import { ReactiveElement } from '../utils/reactive-element.js';

export class Store extends ReactiveElement {
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.addEventListener('store:form', ({ detail }) =>
      store.next(detail)
    );
    this.shadowRoot.addEventListener('store:settings', ({ detail }) =>
      settingsStore.next(detail)
    );
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('app-store', Store);
