import { Item } from './item';

export class Pickup {
  public picked = false;
  constructor(public item: Item, public aisle: string | null = null) { }
}
