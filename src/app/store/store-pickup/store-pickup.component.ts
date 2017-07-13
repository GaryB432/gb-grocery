import { Component, Input } from '@angular/core';

import { Pickup } from '../../models/pickup';

@Component({
  selector: 'gbg-store-pickup',
  styleUrls: ['./store-pickup.component.scss'],
  templateUrl: './store-pickup.component.html',
})
export class StorePickupComponent {
  @Input() public pickup: Pickup;
}
