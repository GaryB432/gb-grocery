import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { IDtoAppInfo } from "../shared/interfaces";
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
            this.doReplace(dto).then((done: boolean) => done && this.router.navigateByUrl("home"));
        } catch (e) {
            alert(e);
        }
    }
}
