import { Component, OnInit } from "@angular/core";

import { Item, LogicService } from "../shared";

@Component({
    selector: "gbg-home",
    styleUrls: ["./home.component.scss"],
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    public items: Item[] = [];

    public newName: string = "";

    constructor(private logic: LogicService) {
    }

    public ngOnInit(): void {
        this.logic.load().then(updatedData => {
            this.newName = "";
            return this.items = updatedData.items
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name));
        });
    }

    public addItem(): void {
        if (!!this.newName) {
            this.logic.insertItem(this.newName).then(i => {
                this.ngOnInit();
            });
        }
    }

    public toggleNeeded(item: Item): void {
        item.needed = !item.needed;
        this.logic.updateItem(item);
    }

    public doSwipe(direction: string, item: Item): void {
        console.log(direction, item.name);
    }

}
