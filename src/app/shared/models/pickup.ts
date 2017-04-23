import { Item } from "./item";

export class Pickup {
  public picked: boolean = false;
  constructor(public item: Item, public aisle: string) { }
}
