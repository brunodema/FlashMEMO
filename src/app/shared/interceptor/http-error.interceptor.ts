import { Inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { GenericNotificationService } from '../services/notification/notification.service';
import { GenericAuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { GenericLoggerService } from '../services/logging/logger.service';

/**
 * This global HTTP interceptor implementation is based on these resources: https://www.tektutorialshub.com/angular/angular-http-error-handling/ and https://rollbar.com/blog/error-handling-with-angular-8-tips-and-best-practices/
 */
@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  constructor(
    protected notificationService: GenericNotificationService,
    @Inject('GenericAuthService') protected authService: GenericAuthService,
    protected router: Router,
    @Inject('GenericLoggerService')
    protected loggerService: GenericLoggerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case HttpStatusCode.InternalServerError:
            this.notificationService.showError(
              'An error occured with your request.'
            );
            this.loggerService.logError(error);
            break;
          case HttpStatusCode.Unauthorized:
            if (this.authService.canAttemptTokenRenewal()) {
              this.loggerService.logDebug(
                'Attempting to renew access token via interceptor...',
                this.authService.accessToken
              );
              return this.authService
                .renewAccessToken(this.authService.accessToken)
                .pipe(
                  switchMap((response) => {
                    this.authService.handleCredentials(
                      response,
                      this.authService.storageMode === 'PERSISTENT'
                    );

                    this.loggerService.logDebug(
                      'Successfully renewed credentials via interceptor!'
                    );
                    return next.handle(
                      req.clone({
                        setHeaders: {
                          Authorization: `Bearer ${response.accessToken}`,
                          RefreshToken: response.refreshToken,
                        },
                      })
                    );
                  }),
                  catchError((err) => {
                    this.loggerService.logDebug('Why the hell am I here for?');
                    this.notificationService.showWarning(
                      'Please log in first 🤠'
                    );
                    this.authService.disconnectUser();
                    this.router.navigateByUrl('login');
                    throw new Error(
                      "An error occured while renewing the user's credentials via the http-interceptor."
                    );
                  })
                );
            } else {
              this.loggerService.logDebug(
                'Oops, something is missing for token renewal...'
              );
              this.notificationService.showWarning('Please log in first 🤠');
              this.authService.disconnectUser();
              this.router.navigateByUrl('login');
              throw new Error(
                "It is not possible to renew the user's credentials via the http-interceptor."
              );
            }

          default:
            if (error.error?.errors) {
              this.notificationService.showError(error.error.errors);
            } else {
              // this code branch assumes 'CONNECTION_REFUSED'
              this.notificationService.showWarning(
                'FlashMEMO is having some trouble reaching its servers, please try again 😴'
              );
            }
          // throw error;
        }

        return of();
      })
    );
  }
}
