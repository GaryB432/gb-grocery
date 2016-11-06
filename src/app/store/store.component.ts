import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Store, Pickup, Checkout } from "../shared/models";
import { AbstractGeoCoder } from "./geocoding.service";
import { LogicService } from "../shared/logic.service";

interface IStoreDistance {
    store: Store;
    distance: number;
}

type Aisle = string;

@Component({
    selector: "gbg-store",
    styleUrls: ["./store.component.scss"],
    templateUrl: "./store.component.html"
})
export class StoreComponent implements OnInit {
    public aisles: Aisle[] = [];

    public neededThings: Pickup[] = [];

    public stores: Store[] = [];

    public nbStores: Store[] = [];

    public newName: string = "";

    public selectedStorePlaceId: string = null;

    constructor(private logic: LogicService, private geo: AbstractGeoCoder, private router: Router) {
    }

    public checkoutReady(): boolean {
        return this.selectedStorePlaceId != null && this.neededThings.filter(i => i.picked).length > 0;
    }

    public get selectedStore(): Store {
        return this.nbStores.find(s => s.placeId === this.selectedStorePlaceId);
    }

    public ngOnInit(): void {
        this.geo.getCurrentPosition(
            pc => this.loadWithCurrentCoordinates(pc.coords),
            pec => alert(pec.message)
        );
    }

    public togglePicked(pickup: Pickup): void {
        pickup.picked = !pickup.picked;
    }

    public changeStore(): void {
        const newStore: Store = this.selectedStore;
        if (!newStore) { throw new Error("changing to null store"); }
        this.neededThings.forEach(t => t.aisle = LogicService.predictAisle(t.item, newStore));
        this.neededThings = LogicService.sortPickups(this.neededThings.slice());
        this.aisles = LogicService.getStoreAisles(newStore);
    }

    public addCheckout(): void {
        this.logic.insertCheckout(
            this.selectedStorePlaceId,
            this.selectedStore,
            this.neededThings
                .filter(i => i.picked))
            .then((co: Checkout) => {
                alert(`Thank you for shopping at ${co.store.name}`);
                this.router.navigateByUrl("/");
            });
    }

    private loadWithCurrentCoordinates(coords: Coordinates): void {
        this.logic.load().then(updatedData => {
            this.neededThings = updatedData.items
                .slice()
                .filter(i => i.needed)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(i => new Pickup(i, undefined));

            this.stores = updatedData.stores;

            this.geo.nearbyStoreSearch(coords)
                .then(nearbyPlaces => {
                    this.nbStores = this.logic.getStoresFromNearbyPlaces(nearbyPlaces)
                        .map(store => {
                            return {
                                store: store,
                                distance: this.geo.computeDistanceBetween(coords, store.location)
                            };
                        })
                        .sort((a, b) => a.distance - b.distance)
                        .map(ds => ds.store);

                    if (this.nbStores.length > 0) {
                        this.selectedStorePlaceId = this.nbStores[0].placeId;
                        this.changeStore();
                    }
                })
                .catch(() => {
                    alert("There was a mapping problem or you seem to not be near a grocery store. "
                        + "The Check Out tab is meant for when you are at the store.");
                    this.router.navigateByUrl("/");
                });
        });
    }
}
