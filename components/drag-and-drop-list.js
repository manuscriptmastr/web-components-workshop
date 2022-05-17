import { html } from 'lit-html';
import { ReactiveElement } from '../utils/reactive-element.js';

const moveItem = (list, from, to) => {
  const _list = [...list];
  let cutOut = _list.splice(from, 1)[0];
  _list.splice(to, 0, cutOut);
  return _list;
};

const ASSISTIVE_TEXT = {
  initial: '',
  enabled: (items, pos) =>
    `Arrow keys enabled on item ${pos + 1} of ${items.length}.`,
  moving: (items, from, to) =>
    `Moving item ${from + 1} of ${items.length} to position ${to + 1} of ${
      items.length
    }.`,
  finished: (items, pos) =>
    `Finished moving item, final position ${pos + 1} of ${items.length}.`,
};

export class DragAndDropUl extends ReactiveElement {
  state = {
    items: ['blue', 'green', 'red'],
    allowMove: false,
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
  };

  handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  handleDrop = (event) => {
    event.preventDefault();
    const from = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const to = this.getPositionFromElement(event.target);
    this.state.items = moveItem(this.state.items, from, to);
  };

  handleKeyUp = (event) => {
    let from;
    let to = this.getPositionFromElement(event.target);

    switch (event.code) {
      case 'ArrowUp':
        from = this.getPositionFromElement(event.target);
        to = from - 1;
        if (to >= 0 && this.state.allowMove) {
          this.state.items = moveItem(this.state.items, from, to);
          this.state.assistiveText = ASSISTIVE_TEXT.moving(
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
        if (to <= this.state.items.length - 1 && this.state.allowMove) {
          this.state.items = moveItem(this.state.items, from, to);
          this.state.assistiveText = ASSISTIVE_TEXT.moving(
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
        this.state.allowMove = !this.state.allowMove;
        if (this.state.allowMove) {
          this.state.assistiveText = ASSISTIVE_TEXT.enabled(
            this.state.items,
            to
          );
        } else {
          this.state.assistiveText = ASSISTIVE_TEXT.finished(
            this.state.items,
            to
          );
        }
        requestAnimationFrame(() => {
          this.getElementFromPosition(to).focus();
        });
        break;
      default:
        this.state.allowMove = false;
        if (/^Moving item/.test(this.state.assistiveText)) {
          this.state.assistiveText = ASSISTIVE_TEXT.finished(
            this.state.items,
            to
          );
        } else {
          this.state.assistiveText = ASSISTIVE_TEXT.initial;
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
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 1.5rem;
        }

        li {
          color: white;
        }
      </style>
      <span role="alert" aria-live="assertive" sr-only
        >${this.state.assistiveText}</span
      >
      <span id="drag-and-drop-instructions" sr-only
        >Press spacebar to move focused item up or down with arrow keys. To
        disable arrow keys, press spacebar again.</span
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
