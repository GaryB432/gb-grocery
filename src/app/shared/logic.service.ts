import { Injectable } from '@angular/core';

import { AppInfo } from '../models/appinfo';
import { Checkout } from '../models/checkout';
import { Item } from '../models/item';
import { Pickup } from '../models/pickup';
import { Store } from '../models/store';
import { DataService } from '../shared/data/data.service';
import { Place } from '../shared/geo/place';
import { Utilities } from './utilities';

type Aisle = string;

interface AisleParts {
  num: number;
  alpha: string;
}

@Injectable()
export class LogicService {
  private static aisleRegex: RegExp = /^(\d+)(\w*)$/;

  private cache!: AppInfo;

  private loaded!: Promise<AppInfo>;

  constructor(private data: DataService) {}

  public clearAll(): void {
    this.data.clearAll();
  }

  public deleteItem(item: Item, context: AppInfo): Promise<AppInfo> {
    const ndx: number = context.items.findIndex(i => i.id === item.id);
    if (ndx < 0) {
      throw new Error(`No item ${item.id} to delete`);
    }
    const spliced: Item = context.items.splice(ndx, 1)[0];

    context.checkouts.forEach(
      co => (co.pickups = co.pickups.filter(pu => pu.item.id !== spliced.id))
    );
    context.checkouts = context.checkouts.filter(co => co.pickups.length > 0);

    return this.saveAll();
  }

  public getItem(id: string): Promise<Item> {
    return this.loaded.then(
      info =>
        new Promise<Item>(
          (resolve, reject): void => {
            const item = info.items.find(i => i.id === id);
            if (!!item) {
              resolve(item);
            } else {
              reject(`No item ${id}`);
            }
          }
        )
    );
  }

  public getCheckout(store: string, isoDate: string): Promise<Checkout> {
    const date = new Date(Date.parse(isoDate)).getTime();
    return this.loaded.then(
      info =>
        new Promise<Checkout>(
          (resolve, reject): void => {
            const checkout = info.checkouts.find(
              co => co.date.getTime() === date && co.store.id === store
            );
            if (!!checkout) {
              resolve(checkout);
            } else {
              reject(`No checkout on ${isoDate} at ${store}`);
            }
          }
        )
    );
  }
  public getStoresFromNearbyPlaces(places: Place[]): Store[] {
    const stores: Store[] = places.map(place => {
      if (!place.placeId) {
        throw new Error('no placeId');
      }

      let store = this.cache.stores.find(s => s.placeId === place.placeId);

      if (!store) {
        /*
        this place does not already have an associated store
        set one up for the dropdown and its id will be applied later
        */
        store = new Store(undefined, place.name);
        store.checkouts = [];
      }

      // update the store with the fresh place information
      /* tslint:disable-next-line:prefer-object-spread */
      Object.assign(store, place, {
        /* tslint:disable-next-line:prefer-object-spread */
        location: Object.assign(
          {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            speed: 0,
          },
          place.location
        ),
      });

      return store;
    });
    this.saveAll();

    return stores;
  }

  public insertCheckout(
    placeId: string,
    newStore: Store,
    distance: number,
    pickups: Pickup[]
  ): Promise<Checkout> {
    let store = this.cache.stores.find(s => s.placeId === placeId);
    if (!store) {
      // the selected store is not already on file
      // this will have an undefined id
      store = newStore;
      store.id = Utilities.makeStoreId();
      this.cache.stores.push(store);
    }

    const co: Checkout = new Checkout(store, new Date());
    co.distance = distance;
    co.pickups = pickups.slice();
    co.pickups.forEach(i => {
      i.item.needed = false;
      i.aisle = i.aisle ? i.aisle.toLocaleUpperCase() : undefined;
    });

    this.cache.checkouts.push(co);

    return this.saveAll().then(() => co);
  }

  public insertItem(name: string): Promise<Item> {
    const id: string = Utilities.makeItemId();
    if (this.cache.items.find(c => c.id === id)) {
      throw new Error('Random id was duplicated! Make a loop to check.');
    }

    const item: Item = Utilities.dtoToItem({
      id,
      name,
      needed: true,
    });

    this.cache.items.push(item);

    return this.saveAll().then(() => item);
  }

  public load(): Promise<AppInfo> {
    this.loaded = this.data
      .load()
      .then(info => LogicService.project(info))
      .then(info => (this.cache = info));
    return this.loaded;
  }

  public updateItem(item: Item): Promise<Item> {
    return this.saveAll().then(() => item);
  }

  private saveAll(): Promise<AppInfo> {
    return this.data.saveAll(this.cache).then(info => (this.cache = info));
  }

  public static predictAisle(item: Item, store: Store): string | undefined {
    if (item.checkouts) {
      const coHere = item.checkouts
        .slice()
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .find(co => co.store.id === store.id);
      if (coHere) {
        const chp = coHere.pickups.find(pu => pu.item.id === item.id);
        if (!chp) {
          throw new Error('no pickup');
        }
        return chp.aisle;
      }
    }
    return undefined;
  }

  public static getStoreAisles(store: Store): Aisle[] {
    return LogicService.sortAisles(
      Utilities.distinct(
        Utilities.flatten(
          store.checkouts.map(c =>
            c.pickups.filter(p => !!p.aisle).map(p => p.aisle)
          )
        )
      )
    );
  }

  public static sortPickups(pickups: Pickup[]): Pickup[] {
    return pickups.sort((a, b) => {
      const itemCompare: number = a.item.name.localeCompare(b.item.name);
      if (a.aisle) {
        if (b.aisle) {
          // both a and b have defined aisles
          const aisleCompare: number = LogicService.compareAisles(
            a.aisle,
            b.aisle
          );
          return aisleCompare < 0 ? -1 : aisleCompare > 0 ? 1 : itemCompare;
        } else {
          // a but no b
          return -1;
        }
      } else if (b.aisle) {
        // no a but b
        return 1;
      } else {
        // neither a nor b have defined aisles
        return itemCompare;
      }
    });
  }

  public static sortAisles(aisles: Aisle[]): Aisle[] {
    // return aisles.slice(0);
    return aisles.slice(0).sort(LogicService.compareAisles);
  }

  public static project(info: AppInfo): AppInfo {
    info.items.forEach(item => (item.checkouts = []));
    info.stores.forEach(store => (store.checkouts = []));
    info.checkouts.forEach(co => {
      co.store.checkouts.push(co);
      co.pickups.forEach(p => p.item.checkouts.push(co));
    });
    return info;
  }

  private static compareAisles(a: Aisle, b: Aisle): number {
    // return a.localeCompare(b);

    function getParts(aisle: Aisle): AisleParts {
      const groups: RegExpExecArray | null = LogicService.aisleRegex.exec(
        aisle
      );
      return groups
        ? { num: parseInt(groups[1], 10), alpha: groups[2] }
        : { num: NaN, alpha: aisle };
    }

    const aparts: AisleParts = getParts(a);
    const bparts: AisleParts = getParts(b);

    if (isNaN(aparts.num)) {
      if (isNaN(bparts.num)) {
        // neither a nor b has a num part
        return aparts.alpha.localeCompare(bparts.alpha);
      } else {
        // b has a num part, a does not
        return 1;
      }
    } else {
      if (isNaN(bparts.num)) {
        // a has a num part, b does not
        return -1;
      } else {
        // both a and b have num part
        const numcomp: number = aparts.num - bparts.num;
        return numcomp === 0
          ? aparts.alpha.localeCompare(bparts.alpha)
          : numcomp;
      }
    }
  }
}
