import { html } from 'lit-html';
import { reactiveElement } from '../utils/reactive-element.js';

export const GalleryLi = reactiveElement(
  ['imagesrc', 'imagealt'],
  ({ imagesrc, imagealt }) =>
    html`
      <style>
        @import 'base.css';

        li {
          filter: brightness(0.5);
        }

        :host(gallery-li[resize]) {
          padding: 3rem;
        }

        :host(gallery-li[resize-min]) {
          background-color: red;
        }

        :host(gallery-li[resize-max]) {
          background-color: green;
        }

        img {
          display: block;
          max-width: 100%;
        }
      </style>
      <li>
        <img src=${imagesrc} alt="${imagealt}" />
      </li>
    `
);

customElements.define('gallery-li', GalleryLi);
