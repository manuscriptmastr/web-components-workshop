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
          z-index: 1;
        }

        :host(gallery-li[resize]) li {
          filter: none;
        }

        :host(gallery-li[resize-min]) li {
          outline: 5px solid red;
        }

        :host(gallery-li[resize-max]) li {
          outline: 5px solid green;
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
