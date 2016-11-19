import { Component, ViewContainerRef } from "@angular/core";
import { ToastsManager } from "ng2-toastr";

import "../style/reset.scss";
import "../style/app.scss";
import "ng2-toastr/ng2-toastr.css";

@Component({
    selector: "gbg-app",
    styleUrls: ["./app.component.scss"],
    templateUrl: "./app.component.html"
})
export class AppComponent {
    constructor(public toastr: ToastsManager, vRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vRef);
    }
}
