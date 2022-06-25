import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
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

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthenticated()) {
      console.log(
        'User is not authenticated. Does an access token exist? Auth-guard is asking:',
        this.authService.accessToken ? true : false
      );
      if (this.authService.canAttemptTokenRenewal()) {
        console.log(
          'It is possible to renew token. Attempting to renew access token via auth-guard...'
        );
        return this.authService
          .renewAccessToken(this.authService.accessToken)
          .pipe(
            map((response) => {
              this.authService.handleCredentials(
                response,
                this.authService.storageMode === 'PERSISTENT'
              );

              console.log('Successfully renewed credentials via auth-guard!');

              return true;
            }),
            catchError((err) => {
              console.log('Credential renewal via auth-guard has failed.');
              this.notificationService.showWarning('Please log in first 🤠');
              this.authService.disconnectUser();
              this.router.navigateByUrl('login');

              return throwError(() => new Error(err));
            })
          );
      } else {
        console.log('Oops, something is missing for token renewal...');
        this.notificationService.showWarning('Please log in first 🤠');
        this.authService.disconnectUser();
        this.router.navigateByUrl('login');
        return false;
      }
    } else {
      console.log(
        'User is authenticated. Redirecting him/her to the desired page...'
      );
      return true;
    }
  }
}
