import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Checkout } from '../models/checkout';
import { LogicService } from '../shared/logic.service';

@Component({
  selector: 'gbg-checkout',
  styleUrls: ['./checkout.component.scss'],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public checkout?: Checkout;
  private sub?: Subscription;
  constructor(private route: ActivatedRoute, private logic: LogicService) {}

  public ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      const { date, store } = params;
      this.logic
        .load()
        .then(() => this.logic.getCheckout(store, date))
        .then(co => {
          this.checkout = co;
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
