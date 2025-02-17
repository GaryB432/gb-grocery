import type { AppInfo } from '../models/appinfo';
import { Checkout } from '../models/checkout';
import { Item } from '../models/item';
import { Pickup } from '../models/pickup';
import { Store } from '../models/store';
import type * as Dto from './data/dto';

// http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript#10727155
function randomString(length: number, chars: string): string {
  let mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:\';"<>?,./|\\';
  let result = '';
  for (let i: number = length; i > 0; --i)
    result += mask[Math.floor(Math.random() * mask.length)];
  return result;
}

export class Utilities {
  public static distinct<T>(arr: T[]): T[] {
    return Array.from(new Set<T>(arr));
  }

  public static dtoToCheckout(dto: Dto.Checkout, context: AppInfo): Checkout {
    const store = context.stores.find((s) => s.id === dto.storeId);
    if (!store) {
      throw new Error('no store');
    }
    const newCheckout: Checkout = new Checkout(store, new Date(dto.isoDate));

    newCheckout.distance = dto.distance || -1;

    newCheckout.pickups = dto.pickups.map((dpu) => {
      const item = context.items.find((i) => i.id === dpu.itemId);
      if (!item) {
        throw new Error('no item');
      }
      return new Pickup(item, dpu.aisle);
    });
    return newCheckout;
  }

  public static dtoToItem(dto: Dto.Item): Item {
    const newItem: Item = new Item();
    newItem.favorite = dto.favorite;
    newItem.id = dto.id;
    newItem.name = dto.name;
    newItem.needed = dto.needed;
    newItem.checkouts = [];
    return newItem;
  }

  // TODO make this on the Store class
  public static dtoToStore(dto: Dto.Store): Store {
    const newStore: Store = new Store(dto.id, dto.name);
    newStore.placeId = dto.place_id;
    newStore.icon = dto.icon;
    newStore.vicinity = dto.vicinity;
    newStore.checkouts = [];
    return newStore;
  }

  public static flatten<T>(list: unknown | unknown[]): T[] {
    if (!Array.isArray(list)) {
      throw new Error('flatten needs an array');
    }
    return list.reduce(
      (a, b) => a.concat(Array.isArray(b) ? Utilities.flatten(b) : b),
      []
    );
  }

  public static makeItemId(): string {
    return Utilities.makeRandomId('i');
  }

  public static makeStoreId(): string {
    return Utilities.makeRandomId('s');
  }

  private static makeRandomId(prefix: string): string {
    return prefix + randomString(5, 'a#');
  }
}
