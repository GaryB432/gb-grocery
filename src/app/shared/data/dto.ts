export interface Store {
  icon: string;
  id: string;
  name: string;
  place_id: string;
  vicinity: string;
}

export interface AppInfo {
  checkouts: Checkout[];
  items: Item[];
  stores: Store[];
}

export interface Pickup {
  aisle: string | undefined;
  itemId: string;
}

export interface Checkout {
  distance?: number;
  isoDate: string;
  pickups: Pickup[];
  storeId: string;
}

export interface Item {
  favorite: boolean;
  id: string;
  name: string;
  needed: boolean;
}
