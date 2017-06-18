import { Component, Input, OnInit } from '@angular/core';

import { Checkout } from '../../models/checkout';
import { Item } from '../../models/item';

@Component({
  selector: 'gbg-home-item',
  templateUrl: './home-item.component.html',
  styleUrls: ['./home-item.component.scss']
})
export class HomeItemComponent implements OnInit {

  @Input() public item: Item;
  public recentCheckout: Checkout;

  public ngOnInit(): void {
    this.recentCheckout = this.item
      .checkouts
      .reduce((pv, cv) => (!pv || !cv.date || cv.date > pv.date) ? cv : pv, null);
  }

}
