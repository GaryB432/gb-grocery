import { NgModule } from '@angular/core';
import { DataIOService } from './data/data-io.service';
import { DataLocalStorageService } from './data/data-local-storage.service';
import { DataService } from './data/data.service';
import { GeoModule } from './geo/geo.module';
import { HammerGesturesDirective } from './hammer-gestures.directive';
import { LogicService } from './logic.service';
import { MomentPipe } from './moment.pipe';

@NgModule({
  declarations: [HammerGesturesDirective, MomentPipe],
  exports: [MomentPipe, HammerGesturesDirective],
  imports: [GeoModule],
  providers: [
    DataService,
    DataIOService,
    DataLocalStorageService,
    LogicService,
  ],
})
export class SharedModule {}
