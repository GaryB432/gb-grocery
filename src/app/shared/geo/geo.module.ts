import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AbstractGeoService } from './abstract-geo.service';
import { GoogleGeoService } from './google-geo.service';
import { MockGeoService } from './mock-geo.service';

const isLocal: boolean = window.location.hostname === 'localhost-not';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    { provide: AbstractGeoService, useClass: isLocal ? MockGeoService : GoogleGeoService },
  ],

})
export class GeoModule { }
