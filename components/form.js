import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement(
  'app-form',
  [],
  ({ useEventListener, useState }) => {
    const [origin, setOrigin] = useState('Worka, Ethiopia');
    useEventListener('form-input', 'input', (event) => setOrigin(event.detail));
    return `<form><form-input label="Origin" value="${origin}"></form-input></form>`;
  }
);
