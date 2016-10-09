import {
    IItem,
    IStore,
    ICheckout,
    Item,
    Store,
    Pickup,
    Checkout,
    AppInfo
} from "../shared";

export class Utilities {
    public static makeid(): string {
        let text: string = "";
        const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i: number = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }
    public static dtoToItem(dto: IItem): Item {
        const newItem: Item = new Item();
        newItem.id = dto.id;
        newItem.name = dto.name;
        newItem.needed = dto.needed;
        newItem.checkouts = [];
        return newItem;
    }
    public static dtoToStore(dto: IStore): Store {
        const newStore: Store = new Store(dto.id, dto.name);
        newStore.formattedAddress = dto.formatted_address;
        newStore.formattedPhoneNumber = dto.formatted_phone_number;
        newStore.placeId = dto.place_id;
        newStore.icon = dto.icon;
        newStore.location = dto.location;
        newStore.types = dto.types;
        newStore.url = dto.url;
        newStore.vicinity = dto.vicinity;
        newStore.website = dto.website;
        newStore.checkouts = [];
        return newStore;
    }
    public static dtoToCheckout(dto: ICheckout, context: AppInfo): Checkout {
        const newCheckout: Checkout = new Checkout(
            context.stores.find(s => s.id === dto.storeId),
            new Date(dto.isoDate)
        );

        // TODO: remove this when items are fully out of storage and switched to pickups
        if (dto.itemsIds !== void 0) { dto.pickups = dto.itemsIds.map(id => { return { itemId: id, aisle: undefined }; }); };

        newCheckout.pickups = dto.pickups
            .map(pu => new Pickup(context.items.find(item => item.id === pu.itemId), pu.aisle));
        return newCheckout;
    }

}
