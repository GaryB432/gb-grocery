import { Point } from './point';

export interface Place {
  formattedAddress: string;
  formattedPhoneNumber: string;
  icon: string;
  location: Point;
  name: string;
  placeId: string;
  types: string[];
  url: string;
  vicinity: string;
  website: string;
}
