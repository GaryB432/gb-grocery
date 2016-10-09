import {
    IItem,
    IDtoStore,
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
    public static dtoToStore(dto: IDtoStore): Store {
        const newStore: Store = new Store(dto.id, dto.name);
        newStore.placeId = dto.place_id;
        newStore.icon = "http://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png";
        newStore.vicinity = dto.vicinity;
        newStore.checkouts = [];
        return newStore;
    }
    public static dtoToCheckout(dto: ICheckout, context: AppInfo): Checkout {
        const newCheckout: Checkout = new Checkout(
            context.stores.find(s => s.id === dto.storeId),
            new Date(dto.isoDate)
        );

        newCheckout.pickups = dto.pickups
            .map(pu => new Pickup(context.items.find(item => item.id === pu.itemId), pu.aisle));
        return newCheckout;
    }

}
