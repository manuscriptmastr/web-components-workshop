import { html } from 'lit-html';
import { useEffect, useState } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], () => {
  const [origin, setOrigin] = useState('Worka, Ethiopia');
  const [roaster, setRoaster] = useState('Madcap Coffee Company');
  useEffect(() => {
    console.log('<app-form> mounting effect');
    return () => console.log('<app-form> unmounting effect');
  }, [origin]);
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

customElements.define('app-form', Form);
