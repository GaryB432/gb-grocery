import { Injectable } from "@angular/core";

import { Utilities } from "../shared/utilities";
import { Item, Store, Pickup, Checkout, AppInfo } from "../shared/models";
import { DataService } from "../shared/data.service";

const flatten: (a: any[][]) => any[] = require("arr-flatten");

function distinct(aisles: Aisle[]): Aisle[] {
  const u: { [id: string]: boolean } = {}, a: Aisle[] = [];
  for (let i: number = 0, l: number = aisles.length; i < l; ++i) {
    if (u.hasOwnProperty(aisles[i])) {
      continue;
    }
    a.push(aisles[i] as string);
    u[aisles[i]] = true;
  }
  return a;
}

type Aisle = string;

@Injectable()
export class LogicService {

  private static aisleRegex: RegExp = /^(\d+)(\w*)$/;

  private cache: AppInfo;

  private loaded: Promise<AppInfo>;

  constructor(private data: DataService) {
  }

  public clearAll(): void {
    this.data.clearAll();
  }

  public deleteItem(item: Item, context: AppInfo): Promise<AppInfo> {

    const ndx: number = context.items.findIndex(i => i.id === item.id);
    if (ndx < 0) {
      throw new Error(`No item ${item.id} to delete`);
    }
    const spliced: Item = context.items.splice(ndx, 1)[0];

    context.checkouts.forEach(co => co.pickups = co.pickups.filter(i => i.item.id !== spliced.id));
    context.checkouts = context.checkouts.filter(co => co.pickups.length > 0);

    return this.saveAll();
  }

  public getItem(id: string): Promise<Item> {
    return this.loaded.then(info =>
      new Promise<Item>((resolve, reject): void => {
        const item: Item = info.items.find(i => i.id === id);
        if (!!item) {
          resolve(item);
        } else {
          reject(`No item ${id}`);
        }
      }));
  }

  public getStoresFromNearbyPlaces(places: google.maps.places.PlaceResult[]): Store[] {
    const stores: Store[] = places.map(place => {
      let store: Store = this.cache.stores.find(s => s.placeId === place.place_id);

      if (!store) {
        store = new Store(undefined, place.name);
        store.checkouts = [];
      }

      store.formattedAddress = place.formatted_address;
      store.formattedPhoneNumber = place.formatted_phone_number;
      store.icon = place.icon;
      store.location = {
        altitudeAccuracy: 0,
        longitude: place.geometry.location.lng(),
        latitude: place.geometry.location.lat(),
        speed: 0,
        heading: 0,
        altitude: 0,
        accuracy: 0
      };
      store.name = place.name;

      if (place.photos) {
        store.photo = place.photos[0].getUrl({ maxHeight: 300, maxWidth: 320 });
      }

      store.placeId = place.place_id;
      store.types = place.types;
      store.url = place.url;
      store.website = place.website;
      store.vicinity = place.vicinity;

      return store;
    });
    this.saveAll();

    return stores;

  }

  public insertCheckout(placeId: string, newStore: Store, pickups: Pickup[]): Promise<Checkout> {
    let store: Store = this.cache.stores.find(s => s.placeId === placeId);
    if (store === void 0) {
      // the selected store is not already on file
      // this will have an undefined id
      store = newStore;
      store.id = Utilities.makeStoreId();
      this.cache.stores.push(store);
    }
    const co: Checkout = new Checkout(
      store, new Date()
    );
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
      throw new Error("Random id was duplicated! Make a loop to check.");
    }

    const item: Item = Utilities.dtoToItem(
      {
        id: id,
        name: name,
        needed: true
      }
    );

    this.cache.items.push(item);

    return this.saveAll().then(() => item);
  }

  public load(): Promise<AppInfo> {
    this.loaded = this.data.load()
      .then(info => LogicService.project(info))
      .then(info => this.cache = info);
    return this.loaded;
  }

  public updateItem(item: Item): Promise<Item> {
    return this.saveAll().then(() => item);
  }

  private saveAll(): Promise<AppInfo> {
    return this.data.saveAll(this.cache).then(info => this.cache = info);
  }

  public static predictAisle(item: Item, store: Store): string {
    if (item.checkouts) {
      const coHere: Checkout = item.checkouts
        .slice()
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .find(co => co.store.id === store.id);
      if (coHere) {
        return coHere.pickups.find(pu => pu.item.id === item.id).aisle;
      }
    }
    return undefined;
  }

  public static getStoreAisles(store: Store): Aisle[] {
    return LogicService.sortAisles(
      distinct(
        flatten(
          store.checkouts
            .map(c => c.pickups
              .filter(p => !!p.aisle)
              .map(p => p.aisle)
            )
        )
      )
    );
  }

  public static sortPickups(pickups: Pickup[]): Pickup[] {
    return pickups.sort((a, b) => {
      const itemCompare: number = a.item.name.localeCompare(b.item.name);
      if (a.aisle) {
        if (b.aisle) { // both a and b have defined aisles
          const aisleCompare: number = LogicService.compareAisles(a.aisle, b.aisle);
          return aisleCompare < 0 ? -1 : aisleCompare > 0 ? 1 : itemCompare;
        } else { // a but no b
          return -1;
        }
      } else if (b.aisle) { // no a but b
        return 1;
      } else { // neither a nor b have defined aisles
        return itemCompare;
      }
    });
  }

  public static sortAisles(aisles: Aisle[]): Aisle[] {
    // return aisles.slice(0);
    return aisles.slice(0).sort(LogicService.compareAisles);
  }

  public static project(info: AppInfo): AppInfo {
    info.items.forEach(item => item.checkouts = []);
    info.stores.forEach(store => store.checkouts = []);
    info.checkouts.forEach(co => {
      co.store.checkouts.push(co);
      co.pickups.forEach(p => p.item.checkouts.push(co));
    });
    return info;
  }

  private static compareAisles(a: Aisle, b: Aisle): number {
    // return a.localeCompare(b);
    type AisleParts = { num: number, alpha: string };

    function getParts(aisle: Aisle): AisleParts {
      let groups: RegExpExecArray = LogicService.aisleRegex.exec(aisle);
      return groups
        ? { num: parseInt(groups[1], 10), alpha: groups[2] }
        : { num: NaN, alpha: aisle };
    };

    const aparts: AisleParts = getParts(a);
    const bparts: AisleParts = getParts(b);

    if (isNaN(aparts.num)) {
      if (isNaN(bparts.num)) { // neither a nor b has a num part
        return aparts.alpha.localeCompare(bparts.alpha);
      } else { // b has a num part, a does not
        return 1;
      }
    } else {
      if (isNaN(bparts.num)) { // a has a num part, b does not
        return -1;
      } else { // both a and b have num part
        const numcomp: number = aparts.num - bparts.num;
        return numcomp === 0 ? aparts.alpha.localeCompare(bparts.alpha) : numcomp;
      }
    }
  }
}
