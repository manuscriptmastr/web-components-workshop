import { html } from 'lit-html';
import { settingsStore } from '../store/observable.js';
import { connect } from '../utils/observable.js';
import { ReactiveElement } from '../utils/reactive-element.js';

export class Settings extends ReactiveElement {
  setInputColor(color) {
    this.dispatchEvent(
      new CustomEvent('store:settings', {
        bubbles: true,
        detail: { inputColor: color, labelColor: this.labelColor },
      })
    );
  }

  setLabelColor(color) {
    this.dispatchEvent(
      new CustomEvent('store:settings', {
        bubbles: true,
        detail: { inputColor: this.inputColor, labelColor: color },
      })
    );
  }

  render() {
    return html`
      <form-input
        label="Label color"
        value="${this.labelColor}"
        @input="${(event) => this.setLabelColor(event.detail)}"
      ></form-input>
      <form-input
        label="Input color"
        value="${this.inputColor}"
        @input="${(event) => this.setInputColor(event.detail)}"
      ></form-input>
    `;
  }
}

customElements.define(
  'app-settings',
  connect(
    settingsStore,
    ({ inputColor, labelColor }) => ({ inputColor, labelColor }),
    Settings
  )
);
