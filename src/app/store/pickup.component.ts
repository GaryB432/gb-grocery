import { Component, Input, OnInit } from "@angular/core";

import { Pickup } from "../shared/models/pickup";

@Component({
  selector: "gbg-pickup",
  styleUrls: ["./pickup.component.scss"],
  templateUrl: "./pickup.component.html",
})
export class PickupComponent implements OnInit {

  @Input() public pickup: Pickup;

  @Input() public aisles: string[];

  public ngOnInit(): void {
    this.aisles = [];
  }

  public setAisle(selectedAisle: string): void {
    this.pickup.aisle = selectedAisle;
  }
}
