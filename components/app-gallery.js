import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { useState } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

export const Gallery = reactiveElement([], () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return html`
    <gallery-ul
      >${[
        'https://images.unsplash.com/photo-1606042166681-f26628260543?w=600',
        'https://images.unsplash.com/photo-1521494994093-d4fe5669b500?w=600',
        'https://images.unsplash.com/photo-1555421689-43cad7100750?w=600',
        'https://images.unsplash.com/photo-1592151450113-bdf5982da169?w=600',
      ].map(
        (imageUrl, index) =>
          html`<gallery-li
            resize="${ifDefined(activeIndex === index ? '23rem' : undefined)}"
            @click="${() => setActiveIndex(index)}"
            imagesrc="${imageUrl}"
            imagealt="Digital Nomad"
          ></gallery-li>`
      )}</gallery-ul
    >
  `;
});

customElements.define('app-gallery', Gallery);
