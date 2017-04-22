import { Injectable } from "@angular/core";

import { DataIoService } from "../shared/data.io.service";
import { IDtoAppInfo } from "./interfaces";
import { AppInfo } from "./models";
import { Utilities } from "./utilities";

@Injectable()
export class DataService {

  constructor(private io: DataIoService) {
  }

  public clearAll(): void {
    this.io.clearAll();
  }

  public load(): Promise<AppInfo> {
    const info: AppInfo = { stores: undefined, items: undefined, checkouts: undefined };

    return this.io.load().then((a) => {
      info.stores = a.stores.map((s) => Utilities.dtoToStore(s));
      info.items = a.items.map((i) => Utilities.dtoToItem(i));
      info.checkouts = a.checkouts.map((c) => Utilities.dtoToCheckout(c, info));
      return info;
    });
  }

  public saveAll(info: AppInfo): Promise<AppInfo> {
    const dto: IDtoAppInfo = {
      stores: info.stores.map((s) => {
        return {
          id: s.id,
          name: s.name,
          place_id: s.placeId,
          vicinity: s.vicinity,
        };
      }),
      items: info.items.map((i) => {
        return {
          id: i.id,
          name: i.name,
          needed: i.needed,
        };
      }),
      checkouts: info.checkouts.map((c) => {
        return {
          storeId: c.store.id,
          isoDate: c.date.toISOString(),
          pickups: c.pickups.map((p) => {
            return {
              itemId: p.item.id,
              aisle: p.aisle,
            };
          }),
        };
      }),
    };

    return this.io.saveAll(dto).then(() => info);
  }

}
