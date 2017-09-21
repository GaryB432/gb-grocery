import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { AuthGuard } from '../auth/auth.guard';
import { DataIoService } from './data-io.service';
import { DataLocalstorageService } from './data-localstorage.service';
import { DataService } from './data.service';
import { HammerGesturesDirective } from './hammer-gestures.directive';
import { LogicService } from './logic.service';
import { MomentPipe } from './moment.pipe';
import { CustomToastOptions } from './toast-options';

@NgModule({
  declarations: [HammerGesturesDirective, MomentPipe],
  exports: [MomentPipe, HammerGesturesDirective],
  imports: [CommonModule, ToastModule.forRoot()],
  providers: [
    { provide: ToastOptions, useClass: CustomToastOptions },
    AuthGuard,
    DataService,
    DataIoService,
    DataLocalstorageService,
    LogicService,
  ],
})
export class SharedModule {}
