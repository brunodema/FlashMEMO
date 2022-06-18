import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GenericAuthService } from '../services/auth.service';
import { GenericNotificationService } from '../services/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class FlashMEMOAuthGuard implements CanActivate {
  constructor(
    @Inject('GenericAuthService') private auth: GenericAuthService,
    protected notificationService: GenericNotificationService,
    public router: Router
  ) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.notificationService.showWarning(
        'Oops, it seems you are not logged in yet 🎱'
      );
      this.router.navigateByUrl('login');
      return false;
    }
    return true;
  }
}
