import { html } from 'lit-html';
import { useState } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Gallery = reactiveElement([], () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return html`
    <gallery-ul
      >${[0, 1, 2, 3].map(
        (num) =>
          html`<gallery-li
            resize="${activeIndex === num ? 'true' : 'false'}"
            threshold="18rem"
            @click="${() => setActiveIndex(num)}"
            imagesrc="https://images.unsplash.com/photo-1652957465310-a5c2cfb1d844?w=600"
            imagealt="Digital Nomad"
          ></gallery-li>`
      )}</gallery-ul
    >
  `;
});

customElements.define('app-gallery', Gallery);
