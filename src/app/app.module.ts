import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeModule } from './home/home.module';
import { ItemComponent } from './item/item.component';
import { LoginModule } from './login/login.module';
import { AuthGuard } from './shared/auth.guard';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from './store/store.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AboutComponent,
    ItemComponent,
    CheckoutComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HomeModule,
    SharedModule,
    StoreModule,
    LoginModule,
  ],
  providers: [AuthGuard],
})
export class AppModule {}
