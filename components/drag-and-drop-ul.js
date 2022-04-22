import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { useState } from '../utils/hooks.js';
import { reactiveElement } from '../utils/reactive-element.js';

const handleDragStart = (event, index) => {
  event.dataTransfer.setData('text/plain', index);
};

const handleDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const moveItem = (list, from, to) => {
  const _list = [...list];
  let cutOut = _list.splice(from, 1)[0];
  _list.splice(to, 0, cutOut);
  return _list;
};

export const DragAndDropUl = reactiveElement([], () => {
  const [items, setItems] = useState(['blue', 'green', 'red']);

  const handleDrop = (event, index) => {
    event.preventDefault();
    const from = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const to = index;
    setItems(moveItem(items, from, to));
  };

  const handleKeyDown = (event, index) => {
    event.preventDefault();
    switch (event.code) {
      case 'ArrowUp':
        return index !== 0 && setItems(moveItem(items, index, index - 1));
      case 'ArrowDown':
        return (
          index !== items.length - 1 &&
          setItems(moveItem(items, index, index + 1))
        );
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
    <ul>
      ${items.map(
        (item, index) => html`<li
          style="background-color: ${item}"
          draggable="true"
          tabindex="0"
          @keyup="${(event) => handleKeyDown(event, index)}"
          @dragstart="${(event) => handleDragStart(event, index)}"
          @dragover="${(event) => handleDragOver(event)}"
          @drop="${(event) => handleDrop(event, index)}"
        >
          Box
        </li>`
      )}
    </ul>
  `;
});

customElements.define('drag-and-drop-ul', DragAndDropUl);
