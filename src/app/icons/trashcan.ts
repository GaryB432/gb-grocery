import { Component } from "@angular/core";

const svg: string = `<svg viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 2H8c0-0.55-0.45-1-1-1H4c-0.55 0-1 0.45-1 1H1c-0.55 0-1 0.45-1 1v1c0 0.55
  0.45 1 1 1v9c0 0.55 0.45 1 1 1h7c0.55 0 1-0.45 1-1V5c0.55 0 1-0.45 1-1v-1c0-0.55-0.45-1-1-1z 
  m-1 12H2V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9z m1-10H1v-1h9v1z" />
</svg>`;

@Component({
  selector: "gbg-trashcan-icon",
  styles: [require("./icon.scss")],
  template: svg,
})
export class TrashcanIconComponent { }
