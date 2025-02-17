import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { AngularFireAuth } from '@angular/fire/compat/auth';
import type { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import type { DataIOService } from '../shared/data/data-io.service';
import type * as Dto from '../shared/data/dto';

@Component({
  selector: 'gbg-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  public buildStamp?: string;
  public displayName?: string;
  public email?: string;
  public env: {
    buildStamp: string;
    firebase: unknown;
    production: boolean;
  } = environment;
  public isAuthenticated = false;
  public jsonInfo = '{}';
  public photoURL = 'assets/img/unauth.jpg';
  public uid?: string;

  public constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private io: DataIOService
  ) {}

  public clearData(): void {
    if (confirm('About to Reset')) {
      this.io.clearAll();
      void this.router.navigateByUrl('home');
    }
  }

  public logout(): void {
    this.afAuth.signOut().then(() => (this.isAuthenticated = false));
  }

  public ngOnInit(): void {
    this.buildStamp = new Intl.DateTimeFormat('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'America/Chicago',
      hour12: true,
    }).format(new Date(this.env.buildStamp));

    this.afAuth.authState.subscribe(async (user) => {
      if (user && user.uid) {
        console.log(user);
        this.isAuthenticated = true;
        this.displayName = user.displayName || 'FALSY NAME';
        this.photoURL = user.photoURL || 'assets/img/unauth.jpg';
        try {
          const info = await this.io.load();
          this.jsonInfo = JSON.stringify(info, null, 2);
        } catch {
          this.jsonInfo = '{error: "unauthenticated"}';
        }
      } else {
        this.displayName = 'NOT LOGGED IN';
      }
    });
  }

  public replaceAppInfoForever(): void {
    try {
      const dto: Dto.AppInfo = JSON.parse(this.jsonInfo);
      this.doReplace(dto)
        .then((done: boolean) => done && this.router.navigateByUrl('home'))
        .catch((e) => console.error(e));
    } catch (e) {
      alert(e);
    }
  }

  private doReplace(newInfo: Dto.AppInfo): Promise<boolean> {
    if (confirm('WARNING this is not validated. About to replace your data')) {
      return this.io.saveAll(newInfo).then(() => true);
    }
    return Promise.resolve(false);
  }
}
