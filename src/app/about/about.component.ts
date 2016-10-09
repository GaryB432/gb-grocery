import {Component} from "@angular/core";
import {Router} from "@angular/router";

import {LogicService} from "../shared";

@Component({
    selector: "gbg-about",
    templateUrl: "./about.component.html",
    styleUrls: ["./about.component.scss"]
})
export class AboutComponent {
    constructor(private router: Router, private logic: LogicService) { }

    public clearData(): void {
        if (confirm("About to Reset")) {
            this.logic.clearAll();
            this.router.navigateByUrl("home");
        }
    }
}
