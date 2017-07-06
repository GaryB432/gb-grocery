import { Component, Input, OnInit } from '@angular/core';

import { Pickup } from '../../models/pickup';

@Component({
  selector: 'gbg-store-pickup',
  styleUrls: ['./store-pickup.component.scss'],
  templateUrl: './store-pickup.component.html',
})
export class StorePickupComponent implements OnInit {

  @Input() public pickup: Pickup;

  @Input() public aisles: string[];

  public ngOnInit(): void {
    this.aisles = [];
  }

  public setAisle(selectedAisle: string): void {
    this.pickup.aisle = selectedAisle;
  }
}
