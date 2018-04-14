import { Component, Input } from '@angular/core';

import { Pickup } from '../../models/pickup';

@Component({
  selector: 'gbg-store-pickup',
  styleUrls: ['./pickup.component.scss'],
  templateUrl: './pickup.component.html',
})
export class PickupComponent {
  @Input() public pickup!: Pickup;
}
