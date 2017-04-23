import { Component, Input, OnInit } from "@angular/core";

import { Checkout } from "../shared/models/checkout";
import { Item } from "../shared/models/item";

@Component({
  selector: "gbg-home-item",
  styleUrls: ["./item.component.scss"],
  templateUrl: "./item.component.html",
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
