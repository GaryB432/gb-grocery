import { Checkout } from './checkout';

export class Store {
  public icon?: string;
  public location!: Coordinates;
  public placeId!: string;
  public vicinity?: string;

  public checkouts!: Checkout[];
  constructor(public id: string | undefined, public name: string) {}
}
