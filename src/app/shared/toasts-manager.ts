import { ApplicationRef, ComponentFactoryResolver, Injectable } from "@angular/core";

import { ToastOptions, ToastsManager } from "ng2-toastr/ng2-toastr";

@Injectable()
export class TopToastsManager extends ToastsManager {
  constructor(componentFactoryResolver: ComponentFactoryResolver, appRef: ApplicationRef, options: ToastOptions) {
    super(componentFactoryResolver, appRef, Object.assign(options, {
      positionClass: "toast-top-center"
    }));
  }
}
