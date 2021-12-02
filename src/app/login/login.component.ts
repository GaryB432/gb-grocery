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
  public error: any;
  public constructor(private afAuth: AngularFireAuth, private router: Router) {}

  public ngOnInit() {
    this.afAuth.authState.subscribe((user: firebase.User | null) => {
      if (user) {
        void this.router.navigateByUrl('home');
      }
    });
  }

  public loginGoogle() {
    void this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    // this.afAuth
    //   .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    //   .then((a) => console.log(a.user))
    //   .catch((e) => console.error(e));
  }
}
