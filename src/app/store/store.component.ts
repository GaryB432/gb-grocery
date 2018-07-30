import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Checkout } from '../models/checkout';
import { Pickup } from '../models/pickup';
import { Store } from '../models/store';
import { AbstractGeoService } from '../shared/geo/abstract-geo.service';
import { LogicService } from '../shared/logic.service';

interface StoreDistance {
  store: Store;
  distance: number;
}

@Component({
  animations: [
    trigger('checkState', [
      state(
        'picked',
        style({
          transform: 'scale(2)',
        })
      ),
      state(
        'notpicked',
        style({
          transform: 'scale(0)',
        })
      ),
      transition('notpicked => picked, picked => notpicked', animate(300)),
    ]),
    trigger('cbhState', [
      state(
        'picked',
        style({
          backgroundColor: 'antiquewhite',
        })
      ),
      state(
        'notpicked',
        style({
          backgroundColor: 'transparent',
        })
      ),
      transition('picked <=> notpicked', [
        animate(
          '200ms ease-out',
          keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(0.8)', offset: 0.3 }),
            style({ transform: 'scale(1)', offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
  selector: 'gbg-store',
  styleUrls: ['./store.component.scss'],
  templateUrl: './store.component.html',
})
export class StoreComponent implements OnInit {
  public neededThings: Pickup[] = [];

  public nbStores: StoreDistance[] = [];

  public newName = '';

  public selectedStorePlaceId: string | null = null;

  constructor(
    private logic: LogicService,
    private geo: AbstractGeoService,
    private router: Router
  ) {}

  public checkoutReady(): boolean {
    return (
      this.selectedStorePlaceId != null &&
      this.neededThings.filter(i => i.picked).length > 0
    );
  }

  public get selectedStore(): StoreDistance | undefined {
    return this.nbStores.find(
      s => s.store.placeId === this.selectedStorePlaceId
    );
  }

  public ngOnInit(): void {
    this.geo
      .getCurrentPosition()
      .then(pc => this.loadWithCurrentCoordinates(pc.coords))
      .catch(pec => alert(pec.message));
  }

  public togglePicked(pickup: Pickup): void {
    pickup.picked = !pickup.picked;
  }

  public changeStore(): void {
    const nbs = this.selectedStore;
    if (!nbs) {
      throw new Error('changing to null store');
    }
    this.neededThings.forEach(t => {
      t.picked = false;
      t.aisle = LogicService.predictAisle(t.item, nbs.store);
    });
    this.neededThings = LogicService.sortPickups(this.neededThings.slice());
  }

  public addCheckout(): void {
    if (this.selectedStorePlaceId && this.selectedStore) {
      this.logic
        .insertCheckout(
          this.selectedStorePlaceId,
          this.selectedStore.store,
          this.selectedStore.distance,
          this.neededThings.filter(i => i.picked)
        )
        .then((co: Checkout) => {
          alert(`Thank you for shopping at ${co.store.name}`);
          this.router.navigateByUrl('/');
        });
    } else {
      alert('Sorry something is wrong.');
    }
  }

  private loadWithCurrentCoordinates(coords: Coordinates): void {
    this.logic.load().then(updatedData => {
      this.neededThings = updatedData.items
        .slice()
        .filter(i => i.needed)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(i => new Pickup(i, undefined));

      this.geo
        .nearbyStoreSearch(coords)
        .then(nearbyPlaces => {
          this.nbStores = this.logic
            .getStoresFromNearbyPlaces(nearbyPlaces)
            .map<StoreDistance>(store => {
              return {
                distance: this.geo.computeDistanceBetween(
                  coords,
                  store.location
                ),
                store,
              };
            })
            .sort((a, b) => a.distance - b.distance);

          if (this.nbStores.length > 0) {
            this.selectedStorePlaceId = this.nbStores[0].store.placeId || null;
            this.changeStore();
          }
        })
        .catch(e => {
          alert(
            'There was a mapping problem or you seem to not be near a grocery store. ' +
              'The Check Out tab is meant for when you are at the store.'
          );
          this.router.navigateByUrl('/');
        });
    });
  }
}
