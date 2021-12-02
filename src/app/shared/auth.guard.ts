import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private afAuth: AngularFireAuth, private router: Router) {}
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.afAuth.authState.pipe(
      map((authState) => !!authState),
      tap((authenticated) => {
        if (!authenticated) {
          void this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
      take(1)
    );
  }
}
