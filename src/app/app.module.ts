import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ToastrModule } from 'ngx-toastr';
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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HomeModule,
    SharedModule,
    StoreModule,
    LoginModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      timeOut: 5000,
    }),
  ],
  providers: [AuthGuard],
})
export class AppModule {}
