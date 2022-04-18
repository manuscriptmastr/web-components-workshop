import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { useState } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], () => {
  const [origin, setOrigin] = useState('Worka, Ethiopia');
  const [roaster, setRoaster] = useState('Madcap Coffee Company');
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
