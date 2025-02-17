import { Item } from './item';

export class Pickup {
  public constructor(
    public item: Item,
    public aisle: string | undefined,
    public picked?: boolean
  ) {}
}
