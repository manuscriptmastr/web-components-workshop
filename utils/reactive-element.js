import { render } from 'https://unpkg.com/lit-html@2.2.2/lit-html.js';

export class ReactiveElement extends HTMLElement {
  static reactiveProperty = (object, key, initialValue, notify = () => {}) => {
    object[`_${key}`] = initialValue;
    Object.defineProperty(object, key, {
      get() {
        return object[`_${key}`];
      },
      set(newValue) {
        const oldValue = object[`_${key}`];
        object[`_${key}`] = newValue;
        notify(key, oldValue, newValue);
      },
    });
  };

  static reflectiveProperty = (object, key, type = String) => {
    Object.defineProperty(object, key, {
      get() {
        const attribute = object.getAttribute(key);
        const hasAttribute = object.hasAttribute(key);
        return type === String
          ? String(attribute)
          : type === Number
          ? Number(attribute)
          : type === Boolean
          ? attribute !== 'false' && hasAttribute
            ? true
            : false
          : JSON.parse(attribute);
      },
    });
  };

  static get observedAttributes() {
    return this.properties || [];
  }

  state = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.constructor.observedAttributes.forEach((keyOrObj) =>
      typeof keyOrObj === 'object'
        ? ReactiveElement.reflectiveProperty(this, keyOrObj.name, keyOrObj.type)
        : ReactiveElement.reflectiveProperty(this, keyOrObj)
    );
  }

  _render() {
    render(this.render(), this.shadowRoot);
  }

  connectedCallback() {
    Object.entries(this.state).forEach(([key, value]) =>
      ReactiveElement.reactiveProperty(
        this.state,
        key,
        value,
        this._render.bind(this)
      )
    );
    this._render();
  }

  attributeChangedCallback(key, prev, curr) {
    if (prev !== curr) {
      this._render();
    }
  }
}
