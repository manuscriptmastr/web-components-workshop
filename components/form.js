import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';
import { FormState } from '../state/form.js';
import { observe } from '../utils/observe.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], ({ origin, roaster, setForm }) => {
  const setFormField = curry((key, value) =>
    setForm(({ [key]: _, ...form }) => ({ [key]: value, ...form }))
  );
  const setOrigin = setFormField('origin');
  const setRoaster = setFormField('roaster');
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

customElements.define(
  'app-form',
  observe(
    FormState,
    (I) => I,
    (setForm) => ({ setForm }),
    Form
  )
);
