import {
  animate,
  animateChild,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Checkout } from '../../models/checkout';
import { Item } from '../../models/item';
import { LogicService } from '../../shared/logic.service';

type Color = string;

const brand: Color = '#B2D235';

@Component({
  animations: [
    trigger('itemState', [
      state(
        'needed',
        style({
          backgroundColor: brand,
          transform: 'scale(1)',
        })
      ),
      state(
        'notneeded',
        style({
          backgroundColor: 'transparent',
          transform: 'scale(0.95)',
        })
      ),
      transition('notneeded <=> needed', [
        query('@badgeAnimation', [animateChild()]),
        animate('0.2s'),
      ]),
    ]),
    trigger('badgeAnimation', [
      state(
        'needed',
        style({
          backgroundColor: 'white',
          color: 'inherit',
        })
      ),
      state(
        'notneeded',
        style({
          backgroundColor: brand,
          color: 'white',
        })
      ),
      transition('notneeded <=> needed', [animate('0.2s')]),
    ]),
  ],
  selector: 'gbg-home-item',
  styleUrls: ['./home-item.component.scss'],
  templateUrl: './home-item.component.html',
})
export class HomeItemComponent implements OnInit {
  @Input() public item!: Item;
  public recentCheckout?: Checkout;
  public pickupCount = 0;

  public constructor(private logic: LogicService) {}

  public ngOnInit(): void {
    this.pickupCount = this.item.checkouts.length;
    this.recentCheckout =
      this.pickupCount > 0
        ? this.item.checkouts.reduce((pv, cv) =>
            !pv || !pv.date || !cv.date || cv.date > pv.date ? cv : pv
          )
        : undefined;
  }

  public getState(): string {
    return this.item.needed ? 'needed' : 'notneeded';
  }

  public toggleFavorite(): void {
    this.item.favorite = !this.item.favorite;
    void this.logic.updateItem(this.item);
  }
  public toggleNeeded(): void {
    this.item.needed = !this.item.needed;
  }
}
