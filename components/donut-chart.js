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
          /* Note that stroke-linecap and stroke-width must be factored in when divided up available space */
          stroke-linecap: round;
          stroke-width: 2;
        }

        text {
          font-size: 0.5rem;
        }
      </style>
      <svg viewBox="0 0 34 34">
        <!-- Segments are grouped and rotated so that zero begins at a different point of the circle -->
        <g>
          <!-- Radius is set so that circumference equals 100 absolute units -->
          <circle
            r="15.91549430918954"
            cx="17"
            cy="17"
            stroke="orange"
            stroke-dasharray="30 999"
            stroke-dashoffset="0"
          ></circle>
          <circle
            r="15.91549430918954"
            cx="17"
            cy="17"
            stroke="green"
            stroke-dasharray="37 999"
            stroke-dashoffset="-33"
          ></circle>
          <!-- Area we plan not to use: -->
          <!-- <circle
            r="15.91549430918954"
            cx="17"
            cy="17"
            stroke="blue"
            stroke-dasharray="28 999"
            stroke-dashoffset="-71"
          ></circle> -->
        </g>
        <!-- Centered text -->
        <text x="17" y="17" text-anchor="middle" alignment-baseline="central">
          10
        </text>
      </svg>
    `;
  }
}

customElements.define('donut-chart', DonutChart);
