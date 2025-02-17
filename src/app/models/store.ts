import { Checkout } from './checkout';

export class Store {
  public icon?: string;
  public location!: GeolocationCoordinates;
  public placeId!: string;
  public vicinity?: string;

  public checkouts!: Checkout[];
  public constructor(public id: string | undefined, public name: string) {}
}
