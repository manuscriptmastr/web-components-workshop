import { html } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';
import { ReactiveElement } from '../utils/reactive-element.js';

const moveItem = (list, from, to) => {
  const _list = [...list];
  let cutOut = _list.splice(from, 1)[0];
  _list.splice(to, 0, cutOut);
  return _list;
};

export class DragAndDropUl extends ReactiveElement {
  state = {
    items: ['blue', 'green', 'red'],
    allowMove: false,
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
          requestAnimationFrame(() => {
            this.getElementFromPosition(to).focus();
          });
        }
        break;
      case 'Space':
        this.state.allowMove = !this.state.allowMove;
        break;
      default:
        this.state.allowMove = false;
    }
  };

  render() {
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
        ${this.state.items.map(
          (item) => html`<li
            aria-describedby="h1"
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
