import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Checkout } from '../models/checkout';
import { AbstractGeoService } from '../shared/geo/abstract-geo.service';
import { Place } from '../shared/geo/place';
import { LogicService } from '../shared/logic.service';

@Component({
  selector: 'gbg-checkout',
  styleUrls: ['./checkout.component.scss'],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public checkout?: Checkout;
  public place?: Partial<Place>;
  private sub?: Subscription;
  constructor(
    private logic: LogicService,
    private geo: AbstractGeoService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    // https://medium.com/@AAlakkad/angular-2-display-html-without-sanitizing-filtering-17499024b079

    this.sub = this.route.params.subscribe(params => {
      const { date, store } = params;
      this.logic
        .load()
        .then(() => this.logic.getCheckout(store, date))
        .then(co => {
          co.pickups = co.pickups.sort((a, b) =>
            a.item.name.localeCompare(b.item.name)
          );
          this.checkout = co;
          return this.geo.getPlaceDetails(this.checkout.store.placeId);
        })
        .then(p => {
          console.log(p);
          this.place = p;
        })
        .catch(err => {
          alert(err);
        });
    });
  }

  public ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
