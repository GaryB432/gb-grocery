import {
  Directive,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

export type GestureType = 'swipeleft' | 'swiperight' | 'tap';

export interface GestureEvent {
  type: GestureType;
}

@Directive({
  selector: '[gbgHammerGestures]',
})
export class HammerGesturesDirective implements OnInit {
  @Output()
  public onGesture: EventEmitter<GestureEvent> = new EventEmitter<
    GestureEvent
  >();

  constructor(private el: ElementRef) {}

  public ngOnInit(): void {
    const events: GestureType[] = ['swipeleft', 'swiperight', 'tap'];

    const hammertime: HammerManager = new Hammer(this.el.nativeElement, {
      recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }],
        [Hammer.Tap],
      ],
    });

    events.forEach(type =>
      hammertime.on(type, _ev => this.onGesture.emit({ type }))
    );
  }
}
