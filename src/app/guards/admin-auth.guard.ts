import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.afAuth.authState
      .take(1)
      .map(user => user.email === 'admin@jistic.com')
      .do(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['/login']);
        }
      })
  }
}
