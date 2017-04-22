import * as Dto from "../shared/dto";
import { AppInfo, Checkout, Item, Pickup, Store } from "../shared/models";

// http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript#10727155
function randomString(length: number, chars: string): string {
  let mask: string = "";
  /* tslint:disable:curly */
  if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
  if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (chars.indexOf("#") > -1) mask += "0123456789";
  if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:';\"<>?,./|\\";
  let result: string = "";
  for (let i: number = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
  /* tslint:enable:curly */
  return result;
}

export class Utilities {
  public static makeItemId(): string {
    return Utilities.makeRandomId("i");
  }

  public static makeStoreId(): string {
    return Utilities.makeRandomId("s");
  }

  public static dtoToItem(dto: Dto.Item): Item {
    const newItem: Item = new Item();
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
    newStore.icon = "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png";
    newStore.vicinity = dto.vicinity;
    newStore.checkouts = [];
    return newStore;
  }

  public static dtoToCheckout(dto: Dto.Checkout, context: AppInfo): Checkout {
    const newCheckout: Checkout = new Checkout(
      context.stores.find((s) => s.id === dto.storeId),
      new Date(dto.isoDate),
    );

    newCheckout.pickups = dto.pickups
      .map((pu) => new Pickup(context.items.find((item) => item.id === pu.itemId), pu.aisle));
    return newCheckout;
  }

  private static makeRandomId(prefix: string): string {
    return prefix + randomString(5, "a#");
  }

}
