import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
        this.authService.activateAccount(activationToken).subscribe({
          next: () => {
            this.isActivationSuccessful = true;
          },
          error: (error: HttpErrorResponse) => {
            this.isActivationSuccessful = false;
            if (error.status !== 500) {
              // I would rather not show any 500 messages here
              this.failureReason = error.error.message;
            }
          },
          complete: () => this.spinnerService.hideSpinner(SpinnerType.LOADING),
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
