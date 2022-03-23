# Web Components Workshop

1. Setting up `index.html` with `<form-input>`

   - `<form-input value label id></form-input>` (Note the closing tag and 2+ words are required for custom elements)`
   - `type="module"`
   - `customElements.define()`
   - `class extends HTMLElement {}`
   - One-time setup with `constructor()` and `innerHTML`
   - Note: we cannot inspect DOM nodes inside `<form-input>`
