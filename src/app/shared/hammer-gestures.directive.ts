import {
    Directive,
    ElementRef,
    Output,
    EventEmitter,
    AfterViewInit
} from "@angular/core";

@Directive({
    selector: "[gbgHammerGestures]"
})
export class HammerGesturesDirective implements AfterViewInit {
    private static hammerInitialized: boolean = false;

    @Output() public onGesture: EventEmitter<string> = new EventEmitter<string>();

    constructor(private el: ElementRef) {
    }

    public ngAfterViewInit(): void {
        if (!HammerGesturesDirective.hammerInitialized) {

            const hammertime: HammerManager = new Hammer(this.el.nativeElement, {
                recognizers: [
                    [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }],
                    [Hammer.Tap]
                ],
            });

            hammertime.on("swipeleft", (ev) => {
                this.onGesture.emit("swipeleft");
            });
            hammertime.on("swiperight", (ev) => {
                this.onGesture.emit("swiperight");
            });
            hammertime.on("tap", (ev) => {
                this.onGesture.emit("tap");
            });
            // http://stackoverflow.com/questions/35728451/using-mobile-events-in-angular2
            // uses this initialized check but i removed it

            // HammerGesturesDirective.hammerInitialized = true;
        }

    }
}
