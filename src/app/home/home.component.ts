import { Component, OnInit } from "@angular/core";

import { Item } from "../shared/models";
import { LogicService } from "../shared/logic.service";
import { GestureEvent } from "../shared/hammer-gestures.directive";

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

    public doSwipe(e: GestureEvent, item: Item): void {
        if (e.type !== "tap") {
            alert(`We don't yet have any idea what you mean by '${e.type}' on '${item.name}'. We will figure something out soon.`);
        }
    }

}
