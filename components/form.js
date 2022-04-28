import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], ({ useState }) => {
  const [origin, setOrigin] = useState('Worka, Ethiopia');
  const handleInput = ({ detail }) => setOrigin(detail);
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
