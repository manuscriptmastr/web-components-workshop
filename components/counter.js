import { html } from 'lit-html';
import { attribute, customElement, state } from '../utils/decorators.js';
import { ReactiveElement } from '../utils/reactive-element.js';

@customElement('app-counter')
export class Counter extends ReactiveElement {
  @attribute({ type: Number }) static initialCount = 1;
  @state() accessor count = this.initialCount;

  increment() {
    this.count++;
  }

  decrement() {
    this.count = this.count === 0 ? this.count : this.count - 1;
  }

  reset() {
    this.count = 0;
  }

  render() {
    return html`
      <h1>Count: ${this.count}</h1>
      <button @click="${this.increment.bind(this)}">Increment</button>
      <button @click="${this.decrement.bind(this)}">Decrement</button>
      <button @click="${this.reset.bind(this)}">Reset</button>
    `;
  }
}
