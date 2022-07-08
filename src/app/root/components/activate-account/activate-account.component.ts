import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { GenericLoggerService } from 'src/app/shared/services/logging/logger.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import {
  SpinnerService,
  SpinnerType,
} from 'src/app/shared/services/UI/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css'],
})
export class ActivateAccountComponent {
  constructor(
    protected route: ActivatedRoute,
    @Inject('GenericAuthService') protected authService: GenericAuthService,
    @Inject('GenericNotificationService')
    protected notificationService: GenericNotificationService,
    protected router: Router,
    protected spinnerService: SpinnerService,
    @Inject('GenericLoggerService')
    protected loggerService: GenericLoggerService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.spinnerService.showSpinner(SpinnerType.LOADING);

      let activationToken = params['token'];
      if (activationToken) {
        this.authService
          .activateAccount(activationToken)
          .pipe(
            finalize(() => this.spinnerService.hideSpinner(SpinnerType.LOADING))
          )
          .subscribe({
            next: () => {
              this.isActivationSuccessful = true;
            },
            error: (err: HttpErrorResponse) => {
              this.isActivationSuccessful = false;
              this.failureReason =
                err?.error?.message ??
                'An error occurred while resetting your password.';
            },
          });
      } else {
        this.loggerService.logInformation(
          "No 'activationToken' provided for activate-account page, redirecting to 'home'..."
        );
        this.router.navigateByUrl('/home');
      }
    });
  }

  public isActivationSuccessful: boolean | undefined = undefined;
  public failureReason: string = '???';
}
