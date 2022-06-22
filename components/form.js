import { html } from 'lit-html';
import { useState } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], () => {
  const [origin, setOrigin] = useState('Worka, Ethiopia');
  const [roaster, setRoaster] = useState('Madcap Coffee Company');
  const [zipcode, setZipcode] = useState('12345');
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
      <form-input
        type="zipcode"
        label="Zip Code"
        value="${zipcode}"
        @input="${(event) => setZipcode(event.detail)}"
      ></form-input>
    </form>
  `;
});

customElements.define('app-form', Form);
