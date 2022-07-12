import { html } from 'lit-html';
import { ReactiveElement } from '../utils/reactive-element.js';

export class DonutChart extends ReactiveElement {
  render() {
    return html`
      <style>
        :host {
          --pi: 3.14159265359;
          --radius: 14;
          --circumference: calc(2 * var(--pi) * var(--radius));
        }

        svg {
          display: inline-block;
          height: 200px;
          width: 200px;
        }

        circle {
          --units: 0;
          --offset: 0;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-dasharray: calc(var(--circumference) * var(--units) / 100 - 3)
            999;
          stroke-dashoffset: calc(
            var(--circumference) * var(--offset) / 100 * -1
          );
          stroke-width: 2;
        }

        #slice-1 {
          --units: 35;
          color: orange;
        }

        #slice-2 {
          --units: 15;
          --offset: 35;
          color: green;
        }

        #slice-3 {
          --units: 20;
          --offset: 50;
          color: red;
        }

        #slice-4 {
          --units: 30;
          --offset: 70;
          color: gray;
        }

        #text {
          font-size: 0.5rem;
        }
      </style>
      <svg viewBox="0 0 30 30">
        <circle id="slice-1" r="14" cx="15" cy="15"></circle>
        <circle id="slice-2" r="14" cx="15" cy="15"></circle>
        <circle id="slice-3" r="14" cx="15" cy="15"></circle>
        <circle id="slice-4" r="14" cx="15" cy="15"></circle>
        <text
          id="text"
          x="15"
          y="15"
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
