import {
    Directive,
    ElementRef,
    Output,
    EventEmitter,
    AfterViewInit
} from "@angular/core";

export type GestureType = "swipeleft" | "swiperight" | "tap";

export type GestureEvent = { type: GestureType };

@Directive({
    selector: "[gbgHammerGestures]"
})
export class HammerGesturesDirective implements AfterViewInit {

    @Output() public onGesture: EventEmitter<GestureEvent> = new EventEmitter<GestureEvent>();

    constructor(private el: ElementRef) {
    }

    public ngAfterViewInit(): void {
        const events: GestureType[] = ["swipeleft", "swiperight", "tap"];

        const hammertime: HammerManager = new Hammer(this.el.nativeElement, {
            recognizers: [
                [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }],
                [Hammer.Tap]
            ],
        });

        events.forEach(type => hammertime.on(type, ev => this.onGesture.emit({ type })));
    }

}
