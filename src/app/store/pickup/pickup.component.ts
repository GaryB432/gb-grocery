import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Pickup } from '../../models/pickup';

@Component({
  selector: 'gbg-store-pickup',
  styleUrls: ['./pickup.component.scss'],
  templateUrl: './pickup.component.html',
})
export class PickupComponent {
  @Output() public aisleChanged = new EventEmitter<Pickup>();
  @Input() public pickup!: Pickup;
  public changeAisle(s: string): void {
    this.pickup.aisle = s;
    this.aisleChanged.emit(this.pickup);
  }
}
