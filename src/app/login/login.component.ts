import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'gbg-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public error: any;
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  public ngOnInit() {
    this.afAuth.authState.subscribe((user: firebase.User | null) => {
      if (user) {
        this.router.navigateByUrl('home');
      }
    });
  }

  public loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
