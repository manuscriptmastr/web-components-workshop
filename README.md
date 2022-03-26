# Web Components Workshop

1. Setting up `index.html` with `<form-input>`

   - `<form-input value label id></form-input>` (Note the closing tag and 2+ words are required for custom elements)`
   - `type="module"`
   - `customElements.define()`
   - `class extends HTMLElement {}`
   - One-time setup with `constructor()` and `innerHTML`
   - Note: we cannot inspect DOM nodes inside `<form-input>`

2. Making `<form-input>` reactive

   - Moving `innerHTML` call to lifecycles `connectedCallback()` and `disconnectedCallback()`
   - Adding event listener to `<input>` (`oninput` vs. `addEventListener('input')`)
   - Syncing attributes and properties with getters and setters (props, computed props)
   - `observedAttributes`
   - `attributeChangedCallback()` to re-render and reset event listeners

3. Refactor reactive boilerplate

   - `ReactiveElement` handles adding/removing event listeners and calling `render()`
   - Static `styles` is used by render call
   - Static `properties` is used by `ReactiveElement` to generate observed attributes and getters/setters

4. Separate properties from state
   - `<app-form>` manages form state
   - Static `properties` and `state`
   - Updating DOM and event listeners
