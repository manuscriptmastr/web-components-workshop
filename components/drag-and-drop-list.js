import { html } from 'lit-html';
import { move } from 'ramda';
import { ReactiveElement } from '../utils/reactive-element.js';

const ASSISTIVE_TEXT = {
  initial: '',
  enabled:
    'Entering reorder mode. Use up and down arrow keys to move item, then press spacebar to exit.',
  moved: (items, from, to) =>
    `Moved item ${from + 1} of ${items.length} to position ${to + 1} of ${
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
    const position = this.getPositionFromElement(event.target);
    event.target.style.cursor = 'move';
    event.dataTransfer.setData('text/plain', position);
  };

  handleDragEnd = (event) => {
    event.target.style.cursor = 'initial';
    event.target.style.filter = 'initial';
  };

  handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  handleDragEnter = (event) => {
    event.target.style.filter = 'brightness(50%)';
  };

  handleDragLeave = (event) => {
    event.target.style.filter = 'initial';
  };

  handleDrop = (event) => {
    event.preventDefault();
    const from = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const to = this.getPositionFromElement(event.target);
    this.state.items = move(from, to, this.state.items);
    requestAnimationFrame(() => {
      this.getElementFromPosition(to).focus();
    });
  };

  handleKeyUp = (event) => {
    let from;
    let to = this.getPositionFromElement(event.target);

    switch (event.code) {
      case 'ArrowUp':
        from = this.getPositionFromElement(event.target);
        to = from - 1;
        if (to >= 0 && this.state.reorderMode) {
          this.state.items = move(from, to, this.state.items);
          this.state.assistiveText = ASSISTIVE_TEXT.moved(
            this.state.items,
            from,
            to
          );
          requestAnimationFrame(() => {
            this.getElementFromPosition(to).focus();
          });
        }
        break;
      case 'ArrowDown':
        from = this.getPositionFromElement(event.target);
        to = from + 1;
        if (to <= this.state.items.length - 1 && this.state.reorderMode) {
          this.state.items = move(from, to, this.state.items);
          this.state.assistiveText = ASSISTIVE_TEXT.moved(
            this.state.items,
            from,
            to
          );
          requestAnimationFrame(() => {
            this.getElementFromPosition(to).focus();
          });
        }
        break;
      case 'Space':
        this.state.reorderMode = !this.state.reorderMode;
        if (this.state.reorderMode) {
          this.state.assistiveText = ASSISTIVE_TEXT.enabled;
        } else {
          this.state.assistiveText = ASSISTIVE_TEXT.disabled;
        }
        requestAnimationFrame(() => {
          this.getElementFromPosition(to).focus();
        });
        break;
      default:
        const prevReorderMode = this.state.reorderMode;
        this.state.reorderMode = false;
        if (prevReorderMode) {
          this.state.assistiveText = ASSISTIVE_TEXT.disabled;
        }
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
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 2rem;
        }

        li {
          color: white;
          font-size: 3rem;
          padding: 2rem;
        }

        li:focus {
          outline: 3px solid white;
        }
      </style>
      <span role="alert" aria-live="assertive" sr-only
        >${this.state.assistiveText}</span
      >
      <span id="drag-and-drop-instructions" sr-only
        >Press spacebar to reorder items with up and down arrow keys.</span
      >
      <ul role="listbox">
        ${this.state.items.map(
          (item) => html`<li
            aria-describedby="drag-and-drop-instructions"
            role="option"
            tabindex="0"
            style="background-color: ${item}"
            draggable="true"
            @keyup="${this.handleKeyUp.bind(this)}"
            @dragstart="${this.handleDragStart.bind(this)}"
            @dragend="${this.handleDragEnd.bind(this)}"
            @dragover="${this.handleDragOver.bind(this)}"
            @dragenter="${this.handleDragEnter.bind(this)}"
            @dragleave="${this.handleDragLeave.bind(this)}"
            @drop="${this.handleDrop.bind(this)}"
          >
            ${item} box
          </li>`
        )}
      </ul>
    `;
  }
}

customElements.define('drag-and-drop-ul', DragAndDropUl);
