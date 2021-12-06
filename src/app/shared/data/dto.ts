export interface Store {
  icon: string;
  id: string;
  name: string;
  place_id: string;
  vicinity: string;
}

export interface AppInfo {
  items: Item[];
  stores: Store[];
  checkouts: Checkout[];
}

export interface Pickup {
  itemId: string;
  aisle: string | undefined;
}

export interface Checkout {
  isoDate: string;
  distance?: number;
  storeId: string;
  pickups: Pickup[];
}

export interface Item {
  id: string;
  name: string;
  favorite: boolean;
  needed: boolean;
}
