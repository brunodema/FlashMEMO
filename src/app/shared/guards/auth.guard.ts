import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GenericAuthService } from '../services/auth.service';
import { GenericNotificationService } from '../services/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class FlashMEMOAuthGuard implements CanActivate {
  constructor(
    @Inject('GenericAuthService') private authService: GenericAuthService,
    protected notificationService: GenericNotificationService,
    public router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      console.log(
        'The result for the token check is:',
        this.authService.accessToken ? true : false
      );
      if (this.authService.accessToken) {
        console.log('Attempting to renew access token via auth-guard...');
        this.authService
          .renewAccessToken(this.authService.accessToken)
          .subscribe({
            next: (response) => {
              this.authService.handleCredentials(
                response,
                this.authService.storageMode === 'PERSISTENT'
              );

              console.log('Successfully renewed credentials via auth-guard!');

              return true;
            },
            error: (error) => {
              this.notificationService.showWarning(error);
              this.router.navigateByUrl('login');
              return false;
            },
          });
      } else {
        console.log('Why the hell am I here for?');
        this.notificationService.showWarning('Please log in first 🤠');
        this.router.navigateByUrl('login');
        return false;
      }
    }

    return true;
  }
}
