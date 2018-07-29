import { Checkout } from './checkout';

export class Store {
  public icon = '';
  public location: Coordinates = {
    accuracy: 0,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: 0,
    longitude: 0,
    speed: null,
  };
  public placeId = '';
  public vicinity = '';

  public checkouts!: Checkout[];
  constructor(public id: string | undefined, public name: string) {}
}
