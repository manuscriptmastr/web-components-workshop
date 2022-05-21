import { html } from 'lit-html';
import { createGenerator, withGenerator } from '../utils/generator.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Count = createGenerator({ count: 0 });

export const Counter = reactiveElement(
  [],
  ({ count = 0, increment, decrement }) =>
    html`
      <h1>You have clicked ${count} since opening this page.</h1>
      <button @click="${increment}">Increment</button>
      <button @click="${decrement}">Decrement</button>
    `
);

customElements.define(
  'app-counter',
  withGenerator(
    Count,
    (update) => ({
      increment: () =>
        update(({ count, ...state }) => ({ ...state, count: count + 1 })),
      decrement: () =>
        update(({ count, ...state }) => ({
          ...state,
          count: count > 0 ? count - 1 : count,
        })),
    }),
    Counter
  )
);
