import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GenericNotificationService } from '../services/notification/notification.service';

/**
 * This global HTTP interceptor implementation is based on these resources: https://www.tektutorialshub.com/angular/angular-http-error-handling/ and https://rollbar.com/blog/error-handling-with-angular-8-tips-and-best-practices/
 */
@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  constructor(protected notificationService: GenericNotificationService) {}

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
            this.notificationService.showError(
              'The provided credentials are not valid.'
            );
            break;

          default:
            if (error.error?.errors) {
              this.notificationService.showError(error.error.errors);
            }
            break;
        }

        return of();
      })
    );
  }
}
