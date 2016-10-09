export interface IDtoStore {
    id: string;
    name: string;
    place_id: string;
    vicinity: string;
}

export interface IPickup {
    itemId: string;
    aisle: string;
}

export interface ICheckout {
    isoDate: string;
    storeId: string;
    pickups?: IPickup[];
}

export interface IItem {
    id: string;
    name: string;
    needed: boolean;
}
