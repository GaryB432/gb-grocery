import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { DataIoService } from '../shared/data-io.service';
import * as Dto from '../shared/dto';

@Component({
  selector: 'gbg-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  public jsonInfo: string;
  public isAuthenticated: boolean;
  public uid: string;
  public displayName: string;
  public email: string;
  public photoURL: string;

  constructor(private afAuth: AngularFireAuth, private router: Router, private io: DataIoService) {
  }

  public ngOnInit(): void {
    this.afAuth.authState.subscribe((user: firebase.User) => {
      this.isAuthenticated = !!user;
      this.displayName = user ? user.displayName || 'FALSY NAME' : 'NOT LOGGED IN';
      this.photoURL = user ? user.photoURL || 'assets/img/personal.png' : 'assets/img/personal.png';
      if (this.isAuthenticated) {
        this.io.load().then((info) => {
          this.jsonInfo = JSON.stringify(info, null, 2);
        });
      }
    });
  }

  public clearData(): void {
    if (confirm('About to Reset')) {
      this.io.clearAll();
      this.router.navigateByUrl('home');
    }
  }

  public replaceAppInfoForever(): void {
    try {
      const dto: Dto.AppInfo = JSON.parse(this.jsonInfo);
      this.doReplace(dto).then((done: boolean) => done && this.router.navigateByUrl('home'));
    } catch (e) {
      alert(e);
    }
  }

  public logout() {
    this.afAuth.auth.signOut();
  }

  private doReplace(newInfo: Dto.AppInfo): Promise<boolean> {
    if (confirm('WARNING this is not validated. About to replace your data')) {
      return this.io.saveAll(newInfo).then((_replaced) => true);
    }
    return Promise.resolve(false);
  }
}
