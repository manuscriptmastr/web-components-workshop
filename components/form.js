export class Form extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const self = this;
    Object.entries(self.state).forEach(([key, value]) => {
      self.state[`_${key}`] = value;
      Object.defineProperty(self.state, key, {
        get() {
          return self.state[`_${key}`];
        },
        set(newValue) {
          self.state[`_${key}`] = newValue;
          self.render();
        },
      });
    });

    this.render();
  }

  state = {
    origin: 'Worka, Ethiopia',
  };

  handleInput(event) {
    this.state.origin = event.detail;
  }

  render() {
    this.shadowRoot.innerHTML = `
			<form>
				<form-input label="Origin" value="${this.state.origin}"></form-input>
			</form>
		`;

    this.shadowRoot
      .querySelector('form-input')
      .addEventListener('input', this.handleInput.bind(this));
  }
}

customElements.define('app-form', Form);
