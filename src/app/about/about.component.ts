import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from '../../environments/environment';
import { DataIOService } from '../shared/data/data-io.service';
import * as Dto from '../shared/data/dto';

@Component({
  selector: 'gbg-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  public jsonInfo = '{}';
  public isAuthenticated?: boolean;
  public uid?: string;
  public displayName?: string;
  public email?: string;
  public photoURL?: string;
  public env: {
    firebase: unknown;
    production: boolean;
    buildStamp: string;
  } = environment;

  public constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private io: DataIOService
  ) {}

  public ngOnInit(): void {
    this.afAuth.authState.subscribe(async (user) => {
      if (user && user.uid) {
        this.isAuthenticated = true;
        this.displayName = user.displayName || 'FALSY NAME';
        this.photoURL = user.photoURL || 'assets/img/personal.png';
        const info = await this.io.load();
        this.jsonInfo = JSON.stringify(info, null, 2);
      } else {
        this.displayName = 'NOT LOGGED IN';
      }
    });
  }

  public clearData(): void {
    if (confirm('About to Reset')) {
      this.io.clearAll();
      void this.router.navigateByUrl('home');
    }
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

  public logout(): void {
    void this.afAuth.signOut();
  }

  public buildStamp(): string {
    const e = new Date(this.env.buildStamp).toLocaleDateString();
    return e;
    // return this.env.buildStamp.substr(0, 3);
  }

  private doReplace(newInfo: Dto.AppInfo): Promise<boolean> {
    if (confirm('WARNING this is not validated. About to replace your data')) {
      return this.io.saveAll(newInfo).then((_replaced) => true);
    }
    return Promise.resolve(false);
  }
}
