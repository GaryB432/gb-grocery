import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { LogicService } from '../shared/logic.service';
import { Checkout } from '../models/checkout';
import { Item } from '../models/item';
import { Pickup } from '../models/pickup';

@Component({
  selector: 'gbg-item',
  styleUrls: ['./item.component.scss'],
  templateUrl: './item.component.html',
})
export class ItemComponent implements OnInit, OnDestroy {

  // http://plnkr.co/edit/Bim8OGO7oddxBaa26WzR?p=preview is gold

  public item: Item;

  public checkouts: Checkout[];

  private sub: Subscription;

  constructor(private logic: LogicService, private route: ActivatedRoute, private router: Router) {
  }

  public ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      const key = 'id';
      this.logic.load()
        .then(() => this.logic.getItem(params[key]))
        .then((item) => {
          this.item = item;
          this.checkouts = this.item.checkouts
            .slice()
            .sort((a, b) => b.date.getTime() - a.date.getTime());
        })
        .catch((err) => {
          alert(err);
          this.router.navigateByUrl('/');
        });
    });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public getItemPickup(checkout: Checkout): Pickup {
    return checkout.pickups.find((c) => c.item.id === this.item.id);
  }

  public deleteItem(item: Item): void {
    if (confirm(`The item ${item.name.toUpperCase()} and its associated information will be permanently deleted.`)) {
      this.logic.load()
        .then((info) => this.logic.deleteItem(item, info))
        .then(() => this.router.navigateByUrl('/'));
    }
  }

}
