import { Checkout } from "./checkout";
import { Item } from "./item";
import { Store } from "./store";

export class AppInfo {
  public items: Item[];
  public stores: Store[];
  public checkouts: Checkout[];
}
