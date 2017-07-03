import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleGeoService } from './google-geo.service';
import { MockGeoService } from './mock-geo.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    GoogleGeoService,
    MockGeoService
  ],
})
export class GeoModule { }
