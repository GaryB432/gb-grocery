import {
  animate,
  Component,
  OnInit,
  state,
  style,
  transition,
  trigger,
  ViewContainerRef,
} from "@angular/core";

import { ToastsManager } from "ng2-toastr";

import { GestureEvent } from "../shared/hammer-gestures.directive";
import { LogicService } from "../shared/logic.service";
import { Item } from "../shared/models/item";

@Component({
  animations: [trigger("itemState", [
    state("needed", style({
      backgroundColor: "#00bcd4",
      transform: "scale(1)",
    })),
    state("notneeded", style({
      backgroundColor: "transparent",
      transform: "scale(.9)",
    })),
    transition("notneeded => needed, needed => notneeded", animate(".4s ease-in-out")),
  ])],
  selector: "gbg-home",
  styleUrls: ["./home.component.scss"],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {

  public items: Item[] = [];

  public newName: string = "";

  constructor(private logic: LogicService, private toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit(): void {
    this.logic.load().then((updatedData) => {
      this.toastr.info("Swipe right on needed items.", null, { toastLife: 5000 });
      this.newName = "";
      return this.items = updatedData.items
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  public getState(item: Item): string {
    return item.needed ? "needed" : "notneeded";
  }

  public addItem(): void {
    if (!!this.newName) {
      this.logic.insertItem(this.newName).then((_i) => {
        this.ngOnInit();
      });
    }
  }

  public doSwipe(e: GestureEvent, item: Item): void {
    switch (e.type) {
      case "swipeleft":
        item.needed = false;
        break;
      case "swiperight":
        item.needed = true;
        break;
      default:
        break;
    }
    this.logic.updateItem(item);
  }

}
