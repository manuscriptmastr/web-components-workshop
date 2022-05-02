import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { curry } from 'https://unpkg.com/ramda@0.28.0/es/index.js';
import { FormState } from '../state/form.js';
import { useAtom, useEffect } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

// Hooks flavor
export const Form = reactiveElement([], () => {
  const [{ origin, roaster }, setForm] = useAtom(FormState);
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

// // Higher order component flavor
// export const Form = reactiveElement([], ({ origin, roaster }) => {
//   const setForm = FormState.update;
//   const setFormField = curry((key, value) =>
//     setForm(({ [key]: _, ...form }) => ({ [key]: value, ...form }))
//   );
//   const setOrigin = setFormField('origin');
//   const setRoaster = setFormField('roaster');
//   useEffect(() => {
//     console.log('<app-form> mounting effect');
//     return () => console.log('<app-form> unmounting effect');
//   }, [origin]);
//   return html`
//     <form>
//       <form-input
//         label="Origin"
//         value="${origin}"
//         @input="${(event) => setOrigin(event.detail)}"
//       ></form-input>
//       <form-input
//         label="Roaster"
//         value="${roaster}"
//         @input="${(event) => setRoaster(event.detail)}"
//       ></form-input>
//     </form>
//   `;
// });

// customElements.define('app-form', observe(FormState)((I) => I)(Form));
