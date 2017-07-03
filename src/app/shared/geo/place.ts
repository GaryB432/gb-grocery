import { Point } from './point';

export interface Place {
  formattedAddress: string;
  formattedPhoneNumber: string;
  icon: string;
  location: Point;
  name: string;
  photo: string;
  placeId: string;
  types: string[];
  url: string;
  vicinity: string;
  website: string;
}
