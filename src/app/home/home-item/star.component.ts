import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  animations: [
    trigger('starState', [
      state(
        'off',
        style({
          fill: 'none',
          stroke: 'black',
          transform: 'scale(1)',
          fillOpacity: 0,
        })
      ),
      state(
        'on',
        style({
          fill: '#ff4747',
          stroke: 'none',
          transform: 'scale(1.5)',
          fillOpacity: 1,
        })
      ),
      transition('off <=> on', [animate('0.3s')]),
    ]),
  ],
  selector: 'gbg-star',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      [@starState]="state"
    >
      <path
        d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
      />
    </svg>
  `,
  styles: ['svg { display: block; height: 2em; }'],
})
export class StarComponent {
  @Input() public state = 'off';
}
