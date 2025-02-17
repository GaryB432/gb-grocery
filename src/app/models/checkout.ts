import type { Pickup } from './pickup';
import type { Store } from './store';

export class Checkout {
  public pickups!: Pickup[];
  public distance?: number;
  public constructor(public store: Store, public date: Date) {}
}
