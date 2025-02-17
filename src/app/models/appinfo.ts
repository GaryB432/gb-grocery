import type { Checkout } from './checkout';
import type { Item } from './item';
import type { Store } from './store';

export class AppInfo {
  public items!: Item[];
  public stores!: Store[];
  public checkouts!: Checkout[];
}
