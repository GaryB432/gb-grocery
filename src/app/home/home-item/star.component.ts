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
          transform: 'scale(1)',
          fillOpacity: 0,
        })
      ),
      state(
        'on',
        style({
          fill: '#ff4747',
          transform: 'scale(1.7)',
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
        d="M12 .288l2.833 8.718h9.167l-7.417 5.389 2.833 8.718-7.416-5.388-7.417 5.388 2.833-8.718-7.416-5.389h9.167z"
      />
    </svg>
  `,
  styles: ['svg { display: block; height: 2em; stroke: #ff4747; }'],
})
export class StarComponent {
  @Input() public state = 'off';
}
