import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[gbgLiker]',
})
export class LikerDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow';
  }
}
