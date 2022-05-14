import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GenericAuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public auth: GenericAuthService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      //this.router.navigate(['login']);
      console.log("you're not logged!!!!");
      return false;
    }
    console.log("you're logged!!!!");
    return true;
  }
}
