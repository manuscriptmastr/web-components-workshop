import { html } from 'lit-html';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], ({ useState }) => {
  const [origin, setOrigin] = useState('Worka, Ethiopia');
  const handleInput = (event) => setOrigin(event.detail);

  return html`
    <form>
      <form-input
        label="Origin"
        value="${origin}"
        @input="${handleInput}"
      ></form-input>
    </form>
  `;
});

customElements.define('app-form', Form);
