import { Inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { GenericNotificationService } from '../services/notification/notification.service';
import { GenericAuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * This global HTTP interceptor implementation is based on these resources: https://www.tektutorialshub.com/angular/angular-http-error-handling/ and https://rollbar.com/blog/error-handling-with-angular-8-tips-and-best-practices/
 */
@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  constructor(
    protected notificationService: GenericNotificationService,
    @Inject('GenericAuthService') protected authService: GenericAuthService,
    protected router: Router
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
            console.log(error);
            break;
          case HttpStatusCode.Unauthorized:
            let accessToken = this.authService.accessToken;
            if (accessToken) {
              console.log(
                'Attempting to renew access token via interceptor...',
                accessToken
              );
              return this.authService.renewAccessToken(accessToken).pipe(
                switchMap((response) => {
                  this.authService.handleCredentials(
                    response,
                    this.authService.storageMode === 'PERSISTENT'
                  );

                  console.log(
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
                  console.log('Why the hell am I here for?');
                  this.notificationService.showWarning(
                    'Please log in first 🤠'
                  );
                  this.authService.disconnectUser();
                  this.router.navigateByUrl('login');
                  return of();
                })
              );
            }
            break;

          default:
            // if (error.error?.errors) {
            //   this.notificationService.showError(error.error.errors);
            // } else {
            //   // this code branch assumes 'CONNECTION_REFUSED'
            //   this.notificationService.showWarning(
            //     'FlashMEMO is having some trouble reaching its servers, please try again 😴'
            //   );
            // }
            throw error;
        }

        return of();
      })
    );
  }
}
