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
import { ToastrService } from 'ngx-toastr';
import { AppInfo } from '../models/appinfo';
import { Checkout } from '../models/checkout';
import { Pickup } from '../models/pickup';
import { Store } from '../models/store';
import { CheckmarkElement } from '../shared/elements';
import { AbstractGeoService } from '../shared/geo/abstract-geo.service';
import { LogicService } from '../shared/logic.service';

interface StoreDistance {
  distance: number;
  store: Store;
}

@Component({
  animations: [
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
          backgroundColor: 'unset',
        })
      ),
      transition('picked <=> notpicked', [
        animate(
          '100ms',
          keyframes([
            style({ transform: 'scale(1)' }),
            style({ transform: 'scale(0.8)' }),
            style({ transform: 'scale(1)' }),
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
  public nbStores: StoreDistance[] = [];
  public neededThings: Pickup[] = [];
  public newName = '';
  public selectedStorePlaceId: string | null = null;
  private cachedAppInfo?: AppInfo;

  public constructor(
    private logic: LogicService,
    private geo: AbstractGeoService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  public get selectedStore(): StoreDistance | undefined {
    return this.nbStores.find(
      (s) => s.store.placeId === this.selectedStorePlaceId
    );
  }

  public addCheckout(): void {
    if (this.selectedStorePlaceId && this.selectedStore) {
      void this.logic
        .insertCheckout(
          this.selectedStorePlaceId,
          this.selectedStore.store,
          this.selectedStore.distance,
          this.neededThings.filter((i) => i.picked)
        )
        .then((co: Checkout) => {
          this.toastr.success(`Thank you for shopping at ${co.store.name}`);
          void this.router.navigateByUrl('/');
        });
    } else {
      alert('Sorry something is wrong.');
    }
  }

  public changeStore(_placeID?: string): void {
    const nbs = this.selectedStore;
    if (!nbs) {
      throw new Error('changing to null store');
    }
    if (this.cachedAppInfo) {
      this.neededThings = this.logic.getPickups(this.cachedAppInfo, nbs.store);
    }
  }

  public checkoutReady(): boolean {
    return (
      this.selectedStorePlaceId != null &&
      this.neededThings.filter((i) => i.picked).length > 0
    );
  }

  public ngOnInit(): void {
    this.geo
      .getCurrentPosition()
      .then((pc) => this.loadWithCurrentCoordinates(pc.coords))
      .catch((pec) => alert(pec.message));
  }

  public pickupChanged(pickup: Pickup): void {
    this.logic.changePickup(pickup);
  }

  public togglePicked(pickup: Pickup): void {
    pickup.picked = !pickup.picked;
    this.logic.changePickup(pickup);
  }

  private loadWithCurrentCoordinates(coords: GeolocationCoordinates): void {
    void this.logic
      .load()
      .then((updatedData) => {
        this.cachedAppInfo = updatedData;
        this.geo
          .nearbyStoreSearch(coords)
          .then((nearbyPlaces) => {
            this.nbStores = this.logic
              .getStoresFromNearbyPlaces(nearbyPlaces)
              .map<StoreDistance>((store) => {
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
              const nbs = this.nbStores[0].store;
              this.selectedStorePlaceId = nbs.placeId || null;
            }
            this.neededThings = this.logic.getPickups(
              updatedData,
              this.selectedStore?.store
            );
          })
          .catch((e) => {
            alert(
              'There was a mapping problem or you seem to not be near a grocery store. ' +
                'The Check Out tab is meant for when you are at the store.'
            );
            alert(e);
            void this.router.navigateByUrl('/');
          });
      })
      .catch((e) => {
        console.error(e);
        void this.router.navigateByUrl('/');
      });
  }
}

customElements.define('gb-checkmark', CheckmarkElement);
