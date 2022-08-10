import { html, svg } from 'lit-html';
import { zip } from 'ramda';
import { ReactiveElement } from '../utils/reactive-element.js';

export class DonutChart extends ReactiveElement {
  static properties = ['segment-lengths', 'segment-colors'];

  get segmentLengths() {
    return this['segment-lengths'].split(',').map((len) => parseInt(len, 10));
  }

  get segmentColors() {
    return this['segment-colors'].split(',');
  }

  get segments() {
    return zip(this.segmentColors, this.segmentLengths).map(
      ([color, length], i) => ({
        color,
        length,
        offset: this.segmentLengths.slice(0, i).reduce((a, b) => a + b, 0),
      })
    );
  }

  render() {
    return html`
      <style>
        svg {
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
          ({ color, length, offset }) => svg`
						<circle
							cx="18"
							cy="18"
							r="15.9154943092"
							stroke="${color}"
							stroke-dasharray="${length} 999"
							stroke-dashoffset="${offset * -1}"
						></color>
				`
        )}
			</svg>
			`}
    `;
  }
}

customElements.define('donut-chart', DonutChart);
