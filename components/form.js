import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';
import { FormState } from '../state/form.js';
import { useEffect, useObservable } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], () => {
  const [{ origin, roaster }, setForm] = useObservable(FormState);
  const setFormField = curry((key, value) =>
    setForm(({ [key]: _, ...form }) => ({ [key]: value, ...form }))
  );
  const setOrigin = setFormField('origin');
  const setRoaster = setFormField('roaster');
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
