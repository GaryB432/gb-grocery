import {
  animate,
  animateChild,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  animations: [
    trigger('cbState', [
      state(
        'checked',
        style({
          color: 'green',
          transform: 'scale(2)',
        })
      ),
      state(
        'unchecked',
        style({
          color: 'blue',
          transform: 'scale(0.95)',
        })
      ),
      transition('checked <=> unchecked', animate(600)),
      // transition('notchecked <=> checked', [
      //   query('@badgeAnimation', [animateChild()]),
      //   animate('0.2s'),
      // ]),
    ]),
  ],

  selector: 'gbg-liker',
  templateUrl: './liker.component.html',
  styleUrls: ['./liker.component.scss'],
})
export class LikerComponent implements AfterViewInit {
  @ViewChild('checker') public cb!: ElementRef;
  ngAfterViewInit(): void {
    console.log(this.cb.nativeElement);
  }
  public get checkState(): string {
    if (this.cb) {
      const el = this.cb.nativeElement as HTMLInputElement;
      if (el.checked) {
        return 'checked';
      }
    }
    return 'unchecked';
  }
}
