import { Checkout } from './checkout';

export class Store {
  public formattedAddress: string;
  public formattedPhoneNumber: string;
  public icon: string;
  public location: Coordinates;
  public photo: string;
  public placeId: string;
  public types: string[];
  public url: string;
  public vicinity: string;
  public website: string;
  public checkouts: Checkout[];
  constructor(public id: string, public name: string) { }
}
