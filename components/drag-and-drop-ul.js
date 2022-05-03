import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { useState } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

const moveItem = (list, from, to) => {
  const _list = [...list];
  let cutOut = _list.splice(from, 1)[0];
  _list.splice(to, 0, cutOut);
  return _list;
};

export const DragAndDropUl = reactiveElement([], ({ host }) => {
  const [items, setItems] = useState(['blue', 'green', 'red']);
  const [allowMove, setAllowMove] = useState(false);

  const getPositionFromElement = (element) =>
    Array.from(host.shadowRoot.querySelectorAll('[draggable="true"]')).indexOf(
      element
    );

  const getElementFromPosition = (position) =>
    Array.from(host.shadowRoot.querySelectorAll('[draggable="true"]'))[
      position
    ];

  const handleDragStart = (event) => {
    const position = getPositionFromElement(event.target);
    event.target.style.cursor = 'move';
    event.dataTransfer.setData('text/plain', position);
  };

  const handleDragEnd = (event) => {
    event.target.style.cursor = 'initial';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const from = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const to = getPositionFromElement(event.target);
    setItems(moveItem(items, from, to));
  };

  const handleKeyUp = (event) => {
    let from;
    let to = getPositionFromElement(event.target);

    switch (event.code) {
      case 'ArrowUp':
        from = getPositionFromElement(event.target);
        to = from - 1;
        if (to >= 0 && allowMove) {
          setItems(moveItem(items, from, to));
          requestAnimationFrame(() => {
            getElementFromPosition(to).focus();
          });
        }
        break;
      case 'ArrowDown':
        from = getPositionFromElement(event.target);
        to = from + 1;
        if (to <= items.length - 1 && allowMove) {
          setItems(moveItem(items, from, to));
          requestAnimationFrame(() => {
            getElementFromPosition(to).focus();
          });
        }
        break;
      case 'Space':
        setAllowMove(!allowMove);
        break;
      default:
        setAllowMove(false);
    }
  };

  return html`
    <style>
      ul {
        background-color: gray;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        list-style: none;
        margin: 0;
        padding: 1.5rem;
      }

      li {
        color: white;
      }
    </style>
    <button @click="${console.log}">This should be tabbable first</button>
    <h1 id="h1">Press spacebar to reorder</h1>
    <ul role="listbox">
      ${items.map(
        (item) => html`<li
          aria-describedby="h1"
          role="option"
          tabindex="0"
          style="background-color: ${item}"
          draggable="true"
          @keyup="${handleKeyUp}"
          @dragstart="${handleDragStart}"
          @dragend="${handleDragEnd}"
          @dragover="${handleDragOver}"
          @drop="${handleDrop}"
        >
          ${item} box
        </li>`
      )}
    </ul>
  `;
});

customElements.define('drag-and-drop-ul', DragAndDropUl);
