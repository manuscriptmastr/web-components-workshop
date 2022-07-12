import { html } from 'lit-html';
import { ReactiveElement } from '../utils/reactive-element.js';

export class DonutChart extends ReactiveElement {
  render() {
    return html`
      <style>
        svg {
          display: inline-block;
          height: 200px;
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

        #text {
          font-size: 0.5rem;
        }
      </style>
      <svg viewBox="0 0 34 34">
        <g>
          <circle
            r="15.91549430918954"
            cx="17"
            cy="17"
            stroke="orange"
            stroke-dasharray="70 999"
            stroke-dashoffset="0"
          ></circle>
          <!-- <circle
            r="15.91549430918954"
            cx="17"
            cy="17"
            stroke="blue"
            stroke-dasharray="28 999"
            stroke-dashoffset="-71"
          ></circle> -->
        </g>
        <text
          id="text"
          x="17"
          y="17"
          text-anchor="middle"
          alignment-baseline="central"
        >
          10
        </text>
      </svg>
    `;
  }
}

customElements.define('donut-chart', DonutChart);
