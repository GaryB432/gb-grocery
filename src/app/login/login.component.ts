import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'gbg-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public error: unknown;
  public constructor(private afAuth: AngularFireAuth, private router: Router) {}

  public ngOnInit(): void {
    this.afAuth.authState.subscribe((user: firebase.User | null) => {
      if (user) {
        void this.router.navigateByUrl('home');
      }
    });
  }

  public loginGoogle(): void {
    void this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    // this.afAuth
    //   .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    //   .then((a) => console.log(a.user))
    //   .catch((e) => console.error(e));
  }
}
