import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { useEffect, useState } from '../utils/hooks.js';
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

export const DragAndDropUl = reactiveElement([], ({ host }) => {
  const [items, setItems] = useState(['blue', 'green', 'red']);
  const [tab, setTab] = useState(0);
  const [allowMove, setAllowMove] = useState(false);
  useEffect(() => {
    if (
      host.shadowRoot.activeElement &&
      host.shadowRoot.querySelectorAll('li')[tab] !==
        host.shadowRoot.activeElement
    ) {
      host.shadowRoot.querySelectorAll('li')[tab].focus();
    }
  }, [tab, host.shadowRoot.activeElement]);

  const handleDrop = (event, index) => {
    event.preventDefault();
    const from = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const to = index;
    setItems(moveItem(items, from, to));
    setTab(to);
  };

  const handleKeyUp = (event, index) => {
    event.preventDefault();
    switch (event.code) {
      case 'ArrowUp':
        if (index > 0 && allowMove) {
          const from = index;
          const to = index - 1;
          setItems(moveItem(items, from, to));
          setTab(to);
        }
        break;
      case 'ArrowDown':
        if (index < items.length - 1 && allowMove) {
          const from = index;
          const to = index + 1;
          setItems(moveItem(items, from, to));
          setTab(to);
        }
        break;
      case 'Tab':
        if (host.shadowRoot.activeElement.getAttribute('draggable')) {
          const tab = Array.from(
            host.shadowRoot.querySelectorAll('[draggable="true"]')
          ).indexOf(host.shadowRoot.activeElement);
          setTab(tab);
        }
        break;
      case 'Space':
        setAllowMove(!allowMove);
        break;
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
    <h1 id="h1">
      Use the arrow key to move element higher or lower in priority
    </h1>
    <ul role="listbox">
      ${items.map(
        (item, index) => html`<li
          aria-describedby="h1"
          role="option"
          tabindex="0"
          style="background-color: ${item}"
          draggable="true"
          @keyup="${(event) => handleKeyUp(event, index)}"
          @dragstart="${(event) => handleDragStart(event, index)}"
          @dragover="${(event) => handleDragOver(event)}"
          @drop="${(event) => handleDrop(event, index)}"
        >
          ${item} box
        </li>`
      )}
    </ul>
  `;
});

customElements.define('drag-and-drop-ul', DragAndDropUl);
