export interface IStore {
    formatted_address: string;
    formatted_phone_number: string;
    icon: string;
    id: string;
    location: Coordinates;
    name: string;
    place_id: string;
    types: string[];
    url: string;
    vicinity: string;
    website: string;
}

export interface IPickup {
    itemId: string;
    aisle: string;
}

export interface ICheckout {
    isoDate: string;
    storeId: string;
    itemsIds?: string[]; // TODO: remove this when items are fully out of storage and switched to pickups
    pickups?: IPickup[];
}

export interface IItem {
    id: string;
    name: string;
    needed: boolean;
}
