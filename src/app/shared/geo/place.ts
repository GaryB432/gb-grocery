import { Photo } from './photo';
import { Point } from './point';

export interface Place {
  formattedAddress: string;
  formattedPhoneNumber: string;
  icon: string;
  location: Point;
  name: string;
  photos: Photo[];
  placeId: string;
  types: string[];
  url: string;
  vicinity: string;
  website: string;
}
