import {Component} from "@angular/core";

const svg: string = `<svg viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z" />
</svg>`;

@Component({
    selector: "gbg-plus-icon",
    styles: [require("./icon.scss")],
    template: svg
})
export class PlusIconComponent { }
