import type { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { ActivatedRoute, Router } from '@angular/router';
import type { AngularFireAuth } from '@angular/fire/compat/auth';
import type { Subscription } from 'rxjs';

import type { Checkout } from '../models/checkout';
import type { Item } from '../models/item';
import type { Pickup } from '../models/pickup';
import type { LogicService } from '../shared/logic.service';

@Component({
  selector: 'gbg-item',
  styleUrls: ['./item.component.scss'],
  templateUrl: './item.component.html',
})
export class ItemComponent implements OnInit, OnDestroy {
  public item!: Item;

  public checkouts: Checkout[] = [];

  private sub!: Subscription;

  public constructor(
    afAuth: AngularFireAuth,
    private logic: LogicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      const key = 'id';
      this.logic
        .load()
        .then(() => this.logic.getItem(params[key]))
        .then((item) => {
          this.item = item;
          this.checkouts = this.item.checkouts
            .slice()
            .sort((a, b) => b.date.getTime() - a.date.getTime());
        })
        .catch((err) => {
          console.error(err);
          void this.router.navigateByUrl('/');
        });
    });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public getItemPickup(checkout: Checkout): Pickup {
    const pu = checkout.pickups.find((c) => c.item.id === this.item.id);
    if (!pu) {
      throw new Error('no pickup');
    }
    return pu;
  }

  public deleteItem(item: Item): void {
    if (
      confirm(
        `The item ${item.name.toUpperCase()} and its associated information will be permanently deleted.`
      )
    ) {
      this.logic
        .load()
        .then((info) => this.logic.deleteItem(item, info))
        .then(() => this.router.navigateByUrl('/'))
        .catch((e) => console.error(e));
    }
  }
}
