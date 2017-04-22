import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { DataIoService } from "../shared/data.io.service";
import { IDtoAppInfo } from "../shared/interfaces";

@Component({
  selector: "gbg-about",
  styleUrls: ["./about.component.scss"],
  templateUrl: "./about.component.html",
})
export class AboutComponent implements OnInit {
  public jsonInfo: string;

  constructor(private router: Router, private io: DataIoService) { }

  public ngOnInit(): void {
    this.io.load().then((info) => {
      this.jsonInfo = JSON.stringify(info, null, 2);
    });
  }

  public clearData(): void {
    if (confirm("About to Reset")) {
      this.io.clearAll();
      this.router.navigateByUrl("home");
    }
  }

  public replaceAppInfoForever(): void {
    try {
      const dto: IDtoAppInfo = JSON.parse(this.jsonInfo);
      this.doReplace(dto).then((done: boolean) => done && this.router.navigateByUrl("home"));
    } catch (e) {
      alert(e);
    }
  }

  private doReplace(newInfo: IDtoAppInfo): Promise<boolean> {
    if (confirm("WARNING this is not validated. About to replace your data")) {
      return this.io.saveAll(newInfo).then((_replaced) => true);
    }
    return Promise.resolve(false);
  }
}
