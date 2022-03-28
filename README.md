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
