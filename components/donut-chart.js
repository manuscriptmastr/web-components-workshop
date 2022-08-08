import { html, svg } from 'lit-html';
import { zip } from 'ramda';
import { ReactiveElement } from '../utils/reactive-element.js';

export class DonutChart extends ReactiveElement {
  static properties = ['segment-lengths', 'segment-colors'];

  get segmentLengths() {
    return this['segment-lengths'].split(',').map((str) => parseInt(str, 10));
  }

  get segmentColors() {
    return this['segment-colors'].split(',');
  }

  get segments() {
    return zip(this.segmentLengths, this.segmentColors).map(
      ([length, color], i) => ({
        length,
        color,
        offset: this.segmentLengths.slice(0, i).reduce((a, b) => a + b, 0),
      })
    );
  }

  render() {
    return html`
      <style>
        svg {
          display: block;
          width: 200px;
        }

        circle {
          fill: none;
          stroke-width: 2;
          transition: all ease-in-out 0.1s;
        }
        circle:hover {
          stroke-width: 3;
        }
      </style>
      ${svg`
			<svg viewBox="0 0 36 36">
        ${this.segments.map(
          ({ length, color, offset }) => svg`
				  <circle
          r="15.91549430918954"
          cx="18"
          cy="18"
          stroke="${color}"
          stroke-dasharray="${length} 999"
          stroke-dashoffset="${offset * -1}"
        ></circle>
				`
        )}
      </svg>
			`}
    `;
  }
}

customElements.define('donut-chart', DonutChart);
