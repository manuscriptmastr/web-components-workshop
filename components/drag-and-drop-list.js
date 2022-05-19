import { html } from 'lit-html';
import { move } from 'ramda';
import { ReactiveElement } from '../utils/reactive-element.js';

const ASSISTIVE_TEXT = {
  initial: '',
  enabled:
    'Entering reorder mode. Use up and down arrow keys to move item, then press spacebar to exit.',
  moved: (items, from, to) =>
    `Moved item ${from + 1} of ${items.length} to ${to + 1} of ${
      items.length
    }.`,
  disabled: 'Exited reorder mode.',
};

export class DragAndDropUl extends ReactiveElement {
  state = {
    items: ['blue', 'green', 'red'],
    reorderMode: false,
    assistiveText: ASSISTIVE_TEXT.initial,
  };

  getPositionFromElement = (element) =>
    Array.from(this.shadowRoot.querySelectorAll('[draggable="true"]')).indexOf(
      element
    );

  getElementFromPosition = (position) =>
    Array.from(this.shadowRoot.querySelectorAll('[draggable="true"]'))[
      position
    ];

  handleDragStart = (event) => {
    this.state.reorderMode = true;
    const position = this.getPositionFromElement(event.target);
    event.target.style.cursor = 'move';
    event.dataTransfer.setData('text/plain', position);
  };

  handleDragEnd = (event) => {
    this.state.reorderMode = false;
    event.target.style.cursor = null;
    event.target.style.filter = null;
  };

  handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  handleDragEnter = (event) => {
    event.target.style.filter = 'brightness(90%)';
  };

  handleDragLeave = (event) => {
    event.target.style.filter = null;
  };

  handleDrop = (event) => {
    event.preventDefault();
    const from = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const to = this.getPositionFromElement(event.target);
    this.state.items = move(from, to, this.state.items);
    this.getElementFromPosition(to).focus();
  };

  handleKeyUp = (event) => {
    const from = this.getPositionFromElement(event.target);
    let to = from;

    switch (event.code) {
      case 'Space':
        this.state.reorderMode = !this.state.reorderMode;
        if (this.state.reorderMode) {
          this.state.assistiveText = ASSISTIVE_TEXT.enabled;
        } else {
          this.state.assistiveText = ASSISTIVE_TEXT.disabled;
        }
        break;
      case 'ArrowUp':
        if (from > 0 && this.state.reorderMode) {
          to = from - 1;
          this.state.items = move(from, to, this.state.items);
          this.state.assistiveText = ASSISTIVE_TEXT.moved(
            this.state.items,
            from,
            to
          );
          this.getElementFromPosition(to).focus();
        }
        break;
      case 'ArrowDown':
        if (from < this.state.items.length - 1 && this.state.reorderMode) {
          to = from + 1;
          this.state.items = move(from, to, this.state.items);
          this.state.assistiveText = ASSISTIVE_TEXT.moved(
            this.state.items,
            from,
            to
          );
          this.getElementFromPosition(to).focus();
        }
        break;
    }
  };

  render() {
    return html`
      <style>
        @import 'screen-reader.css';

        ul {
          background-color: gray;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 2rem;
        }

        li {
          background-color: var(--bg-color);
          color: white;
          font-size: 3rem;
          padding: 2rem;
        }

        li:focus,
        li:focus-visible {
          outline: 5px solid white;
        }

        ul.reorder-mode li:not(:focus, :focus-visible) {
          filter: brightness(50%);
        }
      </style>
      <span role="alert" aria-live="assertive" sr-only
        >${this.state.assistiveText}</span
      >
      <span id="drag-and-drop-instructions" sr-only
        >Press spacebar to reorder items with up and down arrow keys.</span
      >
      <ul
        role="listbox"
        class="${this.state.reorderMode ? 'reorder-mode' : ''}"
      >
        ${this.state.items.map(
          (item) =>
            html`<li
              role="option"
              draggable="true"
              tabindex="0"
              style="--bg-color: ${item}"
              @keyup="${this.handleKeyUp.bind(this)}"
              @dragstart="${this.handleDragStart.bind(this)}"
              @dragend="${this.handleDragEnd.bind(this)}"
              @dragover="${this.handleDragOver.bind(this)}"
              @dragenter="${this.handleDragEnter.bind(this)}"
              @dragleave="${this.handleDragLeave.bind(this)}"
              @drop="${this.handleDrop.bind(this)}"
            >
              ${item}
            </li>`
        )}
      </ul>
    `;
  }
}

customElements.define('drag-and-drop-ul', DragAndDropUl);
