import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from '../environments/environment';
import { AboutModule } from './about/about.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeModule } from './home/home.module';
import { ItemModule } from './item/item.module';
import { LoginModule } from './login/login.module';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from './store/store.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AboutModule,
    HomeModule,
    SharedModule,
    StoreModule,
    ItemModule,
    LoginModule,
  ],
  providers: [
    AuthGuard,
  ],
})
export class AppModule { }
