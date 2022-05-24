import { html } from 'lit-html';
import { reactiveElement } from '../utils/reactive-element.js';

export const GalleryUl = reactiveElement(
  [],
  () => html`
    <style>
      @import 'base.css';

      ul {
        background-color: beige;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(Min(20rem, 100%), 1fr));
        list-style: none;
        margin: 0;
        padding: 2rem;
      }
    </style>
    <ul>
      <slot></slot>
    </ul>
  `
);

customElements.define('gallery-ul', GalleryUl);
