import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerGesturesDirective } from './hammer-gestures.directive';
import { MomentPipe } from './moment.pipe';

import { AuthGuard } from '../auth/auth.guard';
import { DataService } from './data.service';
import { DataIoService } from './data-io.service';
import { DataLocalstorageService } from './data-localstorage.service';
import { CustomToastOptions } from './toast-options';
import { LogicService } from './logic.service';

import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';

@NgModule({
  imports: [
    CommonModule,
    ToastModule.forRoot()
  ],
  providers: [
    { provide: ToastOptions, useClass: CustomToastOptions },
    AuthGuard,
    DataService,
    DataIoService,
    DataLocalstorageService,
    LogicService
  ],
  exports: [
    // CommonModule,
    // ToastModule,
    MomentPipe,
    HammerGesturesDirective
  ],
  declarations: [
    HammerGesturesDirective,
    MomentPipe]
  // declarations: [HammerGesturesDirective]
})
export class SharedModule { }
