import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { GenericAuthService } from '../services/auth.service';
import { GenericLoggerService } from '../services/logging/logger.service';
import { GenericNotificationService } from '../services/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class FlashMEMOAuthGuard implements CanActivate {
  constructor(
    @Inject('GenericAuthService') private authService: GenericAuthService,
    protected notificationService: GenericNotificationService,
    public router: Router,
    @Inject('GenericLoggerService') private loggerService: GenericLoggerService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthenticated()) {
      this.loggerService.logDebug(
        'User is not authenticated. Does an access token exist? Auth-guard is asking:',
        this.authService.accessToken ? true : false
      );
      if (this.authService.canAttemptTokenRenewal()) {
        this.loggerService.logDebug(
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
              this.loggerService.logDebug(
                'Successfully renewed credentials via auth-guard!'
              );

              return true;
            }),
            catchError((err) => {
              this.loggerService.logDebug(
                'Credential renewal via auth-guard has failed.'
              );
              this.notificationService.showWarning('Please log in first 🤠');
              this.authService.disconnectUser();
              this.router.navigateByUrl('login');

              return throwError(() => new Error(err));
            })
          );
      } else {
        this.loggerService.logDebug(
          'Oops, something is missing for token renewal...'
        );
        this.notificationService.showWarning('Please log in first 🤠');
        this.authService.disconnectUser();
        this.router.navigateByUrl('login');
        return false;
      }
    } else {
      this.loggerService.logDebug(
        'User is authenticated. Redirecting him/her to the desired page...'
      );
      return true;
    }
  }
}
