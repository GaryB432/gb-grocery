import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { IDtoAppInfo, IItem, IDtoStore } from "../shared/interfaces";
import { Utilities } from "../shared/utilities";
import { DataIoService } from "../shared/data.io.service";

@Component({
    selector: "gbg-about",
    templateUrl: "./about.component.html",
    styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit {
    public jsonInfo: string;

    constructor(private router: Router, private io: DataIoService) { }

    public ngOnInit(): void {
        this.io.load().then(info => {
            this.jsonInfo = JSON.stringify(info, null, 2);
        });
    }

    public clearData(): void {
        if (confirm("About to Reset")) {
            this.io.clearAll();
            this.router.navigateByUrl("home");
        }
    }

    private doReplace(newInfo: IDtoAppInfo): Promise<boolean> {
        if (confirm("WARNING this is not validated. About to replace your data")) {
            return this.io.saveAll(newInfo).then(replaced => true);
        }
        return Promise.resolve(false);
    }

    public replaceAppInfoForever(): void {
        try {
            const dto: IDtoAppInfo = JSON.parse(this.jsonInfo);
            this.doReplace(this.rekey(dto))
                .then((done: boolean) => done && this.router.navigateByUrl("home"));
        } catch (e) {
            alert(e);
        }
    }

    private rekey(dto: IDtoAppInfo): IDtoAppInfo {
        type Map<T> = { [ndx: string]: T };
        type StoreMap = Map<IDtoStore>;
        type ItemMap = Map<IItem>;

        const storeMap: StoreMap = dto.stores.reduce<StoreMap>((pv: StoreMap, cv: IDtoStore) => {
            pv[cv.id] = {
                id: Utilities.makeStoreId(),
                name: cv.name,
                place_id: cv.place_id,
                vicinity: cv.vicinity
            };
            return pv;
        }, {});

        const itemMap: ItemMap = dto.items.reduce<ItemMap>((pv: ItemMap, cv: IItem) => {
            pv[cv.id] = {
                id: Utilities.makeItemId(),
                name: cv.name,
                needed: cv.needed
            };
            return pv;
        }, {});

        return {
            stores: Object.keys(storeMap).map((k: string) => storeMap[k]),
            items: Object.keys(itemMap).map((k: string) => itemMap[k]),
            checkouts: dto.checkouts.map(c => {
                return {
                    storeId: storeMap[c.storeId].id,
                    isoDate: c.isoDate,
                    pickups: c.pickups.map(p => {
                        return {
                            itemId: itemMap[p.itemId].id,
                            aisle: p.aisle
                        };
                    })
                };
            })
        };
    }
}
