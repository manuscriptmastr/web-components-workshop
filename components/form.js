import { html } from 'lit-html';
import { useContext } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], () => {
  const [{ origin, roaster }, setForm] = useContext('form-provider');
  const setOrigin = (origin) => setForm({ origin, roaster });
  const setRoaster = (roaster) => setForm({ origin, roaster });

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
