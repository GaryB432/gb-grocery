import { Pickup } from './pickup';
import { Store } from './store';

export class Checkout {
  public pickups: Pickup[];
  public distance: number;
  constructor(public store: Store, public date: Date) {}
}
