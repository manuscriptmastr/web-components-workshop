import { html } from 'lit-html';
import { ReactiveElement } from '../utils/reactive-element.js';

const reactive = ({ get, set }) => {
  return {
    get() {
      return get.call(this);
    },
    set(value) {
      setTimeout(this.update.bind(this), 0);
      return set.call(this, value);
    },
    init(value) {
      return value;
    },
  };
};

export class Counter extends ReactiveElement {
  @reactive accessor count = 0;

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

customElements.define('app-counter', Counter);
