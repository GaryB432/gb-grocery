import { Checkout } from "./checkout";

export class Item {
  public id: string;
  public name: string;
  public needed: boolean;
  public checkouts: Checkout[];
}
