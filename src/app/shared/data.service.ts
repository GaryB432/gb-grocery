import {Injectable} from "@angular/core";

import {IItem, IPickup, IStore, ICheckout} from "./interfaces";
import {Utilities} from "./utilities";
import {Item, Checkout, AppInfo} from "./models";

const ITEMS_KEY: string = "gbg-items";
const STORES_KEY: string = "gbg-stores";
const CHECKOUTS_KEY: string = "gbg-checkouts";

export class LocalStorage {
    public getItem(key: string): any {
        return localStorage.getItem(key);
    }
    public removeItem(key: string): void {
        localStorage.removeItem(key);
    }
    public setItem(key: string, data: string): void {
        localStorage.setItem(key, data);
    }
}

@Injectable()
export class DataService {
    private info: AppInfo = new AppInfo();

    constructor(private storage: LocalStorage) {
    }

    public addCheckout(c: Checkout): Promise<Checkout> {
        this.info.checkouts.push(c);
        this.writeStores();
        this.writeCheckouts();
        this.writeItems();
        return Promise.resolve(c);
    }

    public addItem(item: Item): Promise<Item> {
        this.info.items.push(item);
        this.writeItems();
        return Promise.resolve(item);
    }

    public clearAll(): void {
        this.storage.removeItem(CHECKOUTS_KEY);
        this.storage.removeItem(STORES_KEY);
        this.storage.removeItem(ITEMS_KEY);
    }

    public load(): Promise<AppInfo> {
        this.readItems();
        this.readStores();
        this.readCheckouts();
        return Promise.resolve(this.info);
    }

    public saveCheckouts(): Promise<AppInfo> {
        this.writeCheckouts();
        return Promise.resolve(this.info);
    }

    public saveItems(): Promise<AppInfo> {
        this.writeItems();
        return Promise.resolve(this.info);
    }

    public saveStores(): Promise<AppInfo> {
        this.writeStores();
        return Promise.resolve(this.info);
    }

    private readCheckouts(): void {
        let data: ICheckout[];
        try {
            let raw: string = this.storage.getItem(CHECKOUTS_KEY);
            data = JSON.parse(raw) || [];
        } catch (ex) {
            console.log(ex.stack);
            data = [];
        }
        finally {
            this.info.checkouts = data.map(s => Utilities.dtoToCheckout(s, this.info));
        }
    }

    private readItems(): void {
        let data: IItem[];
        try {
            let raw: string = this.storage.getItem(ITEMS_KEY);
            data = JSON.parse(raw) || [];
        } catch (ex) {
            console.log(ex.stack);
            data = [];
        }
        finally {
            this.info.items = data.map(s => Utilities.dtoToItem(s));
        }
    }

    private readStores(): void {
        let data: IStore[];
        try {
            let raw: string = this.storage.getItem(STORES_KEY);
            data = JSON.parse(raw) || [];
        } catch (ex) {
            console.log(ex.stack);
            data = [];
        }
        finally {
            this.info.stores = data.map(s => Utilities.dtoToStore(s));
        }
    }

    private writeCheckouts(): void {
        let data: ICheckout[] = this.info.checkouts.map(dto => {
            return {
                storeId: dto.store.id,
                isoDate: dto.date.toISOString(),
                pickups: dto.pickups.map(p => { return <IPickup>{ itemId: p.item.id, aisle: p.aisle }; })
            };
        });
        this.storage.setItem(CHECKOUTS_KEY, JSON.stringify(data));
    }

    private writeItems(): void {
        let data: IItem[] = this.info.items.map(item => {
            return {
                id: item.id,
                name: item.name,
                needed: item.needed
            };
        });
        this.storage.setItem(ITEMS_KEY, JSON.stringify(data));
    }

    private writeStores(): void {
        let data: IStore[] = this.info.stores.map(store => {
            return {
                id: store.id,
                name: store.name,
                formatted_address: store.formattedAddress,
                formatted_phone_number: store.formattedPhoneNumber,
                icon: store.icon,
                location: store.location,
                place_id: store.placeId,
                types: store.types,
                url: store.url,
                vicinity: store.vicinity,
                website: store.website
            };
        });
        this.storage.setItem(STORES_KEY, JSON.stringify(data));
    }

}
