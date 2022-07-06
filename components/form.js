import { html } from 'lit-html';
import { connect, update } from '../store/index.js';
import { useEffect } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Form = reactiveElement([], ({ origin, roaster }) => {
  const setOrigin = (origin) => update((state) => ({ ...state, origin }));
  const setRoaster = (roaster) => update((state) => ({ ...state, roaster }));
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

customElements.define(
  'app-form',
  connect(({ origin, roaster }) => ({ origin, roaster }), Form)
);
