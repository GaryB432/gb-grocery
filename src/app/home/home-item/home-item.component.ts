import { Component, Input, OnInit } from '@angular/core';

import { Checkout } from '../../models/checkout';
import { Item } from '../../models/item';

@Component({
  selector: 'gbg-home-item',
  styleUrls: ['./home-item.component.scss'],
  templateUrl: './home-item.component.html',
})
export class HomeItemComponent implements OnInit {

  @Input() public item: Item;
  public recentCheckout: Checkout | null;

  public ngOnInit(): void {

    this.recentCheckout = this.item.checkouts.length > 0
      ? this.item
        .checkouts
        .reduce((pv, cv) => (!pv || !pv.date || !cv.date || cv.date > pv.date) ? cv : pv)
      : null;
  }

}
