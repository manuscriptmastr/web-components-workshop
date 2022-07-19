import { html } from 'lit-html';
import { formStore, settingsStore } from '../store/observable.js';
import { ReactiveElement } from '../utils/reactive-element.js';

export class Store extends ReactiveElement {
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.addEventListener('store:form', ({ detail }) =>
      formStore.next(detail)
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
