/* tslint:disable:max-classes-per-file */

export class Item {
    public id: string;
    public name: string;
    public needed: boolean;
    public checkouts: Checkout[];
}

export class Pickup {
    public picked: boolean = false;
    constructor(public item: Item, public aisle: string) { }
}

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

export class Checkout {
    public pickups: Pickup[];
    constructor(public store: Store, public date: Date) { }
}

export class AppInfo {
    public items: Item[];
    public stores: Store[];
    public checkouts: Checkout[];
}
