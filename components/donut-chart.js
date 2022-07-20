import { html, svg } from 'lit-html';
import { ReactiveElement } from '../utils/reactive-element.js';

export class DonutChart extends ReactiveElement {
  static properties = ['segments', 'segment-colors', 'gap'];

  get #segments() {
    const weights = this.segments
      .replaceAll(/\s/g, '')
      .split(',')
      .map((str) => parseInt(str, 10));
    return weights;
  }

  get #colors() {
    return this['segment-colors'].replaceAll(/\s/g, '').split(',');
  }

  get #gap() {
    return parseInt(this.gap ?? '1', 10);
  }

  get #spacers() {
    return this.#segments.length - 1;
  }

  get #total() {
    return 70 - this.#spacers * this.#gap;
  }

  get #actualSegments() {
    const multiplier = this.#total / this.#segments.reduce((a, b) => a + b, 0);
    const actual = this.#segments.map((seg) => seg * multiplier);
    return actual.map((length, i) => ({
      color: this.#colors[i],
      length,
      offset: actual.slice(0, i).reduce((a, b) => a + b + this.#gap, 0),
    }));
  }

  render() {
    return html`
      <style>
        svg {
          display: inline-block;
          width: 200px;
        }

        g {
          transform: rotate(0.4turn);
          transform-origin: 50% 50%;
        }

        circle {
          fill: none;
          stroke-linecap: round;
          stroke-width: 2;
        }

        text {
          font-size: 0.5rem;
        }
      </style>
      <svg viewBox="0 0 34 34">
        <g>
          ${this.#actualSegments.map(
            ({ color, length, offset }) => svg`
              <circle
                r="15.91549430918954"
                cx="17"
                cy="17"
                stroke="${color}"
                stroke-dasharray="${length - 2} 999"
                stroke-dashoffset="${offset * -1 - 1}"
              ></circle>
            `
          )}
        </g>
        <text x="17" y="17" text-anchor="middle" alignment-baseline="central">
          ${this.#segments.reduce((a, b) => a + b, 0)}
        </text>
      </svg>
    `;
  }
}

customElements.define('donut-chart', DonutChart);
