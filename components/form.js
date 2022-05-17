import { html } from 'lit-html';
import { consume } from '../utils/generator.js';
import { useEffect, useState } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], ({ count = 0 }) => {
  const [origin, setOrigin] = useState('Worka, Ethiopia');
  const [roaster, setRoaster] = useState('Madcap Coffee Company');
  useEffect(() => {
    console.log('<app-form> mounting effect');
    return () => console.log('<app-form> unmounting effect');
  }, [origin]);
  useEffect(() => {
    console.log(`Count: ${count}`);
  }, [count]);
  return html`
    <form>
      <form-input
        label="Origin"
        value="${origin}"
        @input="${(event) => setOrigin(event.detail)}"
      ></form-input>
      <form-input
        label="Roaster"
        value="${roaster}"
        @input="${(event) => setRoaster(event.detail)}"
      ></form-input>
    </form>
  `;
});

const counter = async function* () {
  let count = 0;
  while (true) {
    await new Promise((res) => setTimeout(res, 3000));
    count++;
    yield { count };
  }
};

customElements.define('app-form', consume(counter, Form));
