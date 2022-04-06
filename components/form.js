import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement(
  'app-form',
  [],
  ({ useEffect, useState }) => {
    const [origin, setOrigin] = useState('Worka, Ethiopia');
    useEffect(() => {
      console.log('Connecting <app-form>');
      return () => {
        console.log('Disconnecting <app-form>');
      };
    }, []);
    return html`<form>
      <form-input
        label="Origin"
        value="${origin}"
        @input="${(event) => setOrigin(event.detail)}"
      ></form-input>
    </form>`;
  }
);
