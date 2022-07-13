import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { finalize } from 'rxjs';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { GenericLoggerService } from 'src/app/shared/services/logging/logger.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import {
  SpinnerService,
  SpinnerType,
} from 'src/app/shared/services/UI/spinner.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent {
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
      this.token = params['token'];
      if (!this.token) {
        this.loggerService.logInformation(
          "No 'resetToken' provided for 'password-reset' page, redirecting to 'home'..."
        );
        this.router.navigateByUrl('/home');
      }
    });
  }

  private token: string = '';

  model: { email: string; password: string };
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      key: 'username',
      type: 'input',
      templateOptions: {
        type: 'text',
        label: 'Username',
        placeholder: 'Please confirm your username',
        required: true,
      },
      className: 'd-block mb-2',
    },
    {
      validators: {
        validation: [
          { name: 'passwordMatch', options: { errorPath: 'passwordConfirm' } },
        ],
      },
      fieldGroup: [
        {
          key: 'password',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'New password',
            placeholder: 'Enter your new password',
            required: true,
          },
          className: 'd-block mb-2',
          validators: {
            validation: ['passwordRequirements'],
          },
        },
        {
          key: 'passwordConfirm',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Confirm password',
            placeholder: 'Repeat your password',
          },
          expressionProperties: {
            'templateOptions.required': (model: any, formState: any) => {
              return model.password?.length > 0;
            },
            'templateOptions.disabled': (model: any, formState: any) => {
              return model.password?.length === 0;
            },
          },
        },
      ],
    },
  ];

  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.showSpinner(SpinnerType.LOADING);

      return this.authService
        .resetPassword(
          this.form.value.username,
          this.token,
          this.form.value.password
        )
        .pipe(
          finalize(() => this.spinnerService.hideSpinner(SpinnerType.LOADING))
        )
        .subscribe({
          next: () => {
            this.notificationService.showSuccess(
              'Password successfully reset.'
            );
            this.router.navigateByUrl('/login');
          },
          error: (err: HttpErrorResponse) =>
            this.notificationService.showError(
              err?.error?.message ??
                'An error occurred while resetting your password.'
            ),
        });
    }

    return this.notificationService.showWarning('The form has problems.');
  }
}
