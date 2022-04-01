import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement(
  'app-form',
  [],
  ({ useEffect, useEventListener, useState }) => {
    const [origin, setOrigin] = useState('Worka, Ethiopia');
    useEffect(() => {
      console.log('Rendering Form');
      return () => {
        console.log('Cleanup up Form');
      };
    });
    useEventListener('form-input', 'input', (event) => setOrigin(event.detail));
    return `<form><form-input label="Origin" value="${origin}"></form-input></form>`;
  }
);
