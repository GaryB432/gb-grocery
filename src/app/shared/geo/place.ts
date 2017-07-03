import { Point } from './point';

export class Place {
  public formattedAddress: string;
  public formattedPhoneNumber: string;
  public icon: string;
  public location: Point;
  public name: string;
  public photo: string;
  public placeId: string;
  public types: string[];
  public url: string;
  public vicinity: string;
  public website: string;
}
