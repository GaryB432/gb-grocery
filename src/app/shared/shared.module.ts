import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataIoService } from './data/data-io.service';
import { DataLocalStorageService } from './data/data-local-storage.service';
import { DataService } from './data/data.service';
import { GeoModule } from './geo/geo.module';
import { HammerGesturesDirective } from './hammer-gestures.directive';
import { LogicService } from './logic.service';
import { MomentPipe } from './moment.pipe';

@NgModule({
  declarations: [HammerGesturesDirective, MomentPipe],
  exports: [MomentPipe, HammerGesturesDirective],
  imports: [CommonModule, GeoModule],
  providers: [
    DataService,
    DataIoService,
    DataLocalStorageService,
    LogicService,
  ],
})
export class SharedModule {}
