import { Pickup } from './pickup';
import { Store } from './store';

export class Checkout {
  public pickups: Pickup[];
  constructor(public store: Store, public date: Date) { }
}
