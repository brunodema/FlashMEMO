import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { finalize } from 'rxjs';
import { GenericLoggerService } from 'src/app/shared/services/logging/logger.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { ILoginRequest } from '../../../shared/models/http/http-request-types';
import { GenericAuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    @Inject('GenericAuthService') private authService: GenericAuthService,
    @Inject('GenericNotificationService')
    private notificationService: GenericNotificationService,
    @Inject('GenericLoggerService')
    private loggerService: GenericLoggerService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.authService.loggedUser.subscribe((user) => {
      if (user) {
        this.loggerService.logDebug(
          'User seems to be already logged, redirecting to home page...',
          user
        );
        this.notificationService.showWarning(
          'You are already logged you silly 😋'
        );
        this.router.navigateByUrl('/home');
      }
    });
  }

  form = new FormGroup({});
  model = {}; // apparently has to be of 'any' type
  fields: FormlyFieldConfig[] = [
    {
      key: 'username',
      type: 'input',
      id: 'username-input',
      templateOptions: {
        attributes: { autocomplete: 'username' }, // this might be getting placed in the wrong spot (label instead?)
        type: 'text',
        label: 'Username',
        placeholder: 'Enter your username',
        required: true,
      },
      className: 'd-block mb-2',
    },
    {
      key: 'password',
      type: 'input',
      id: 'password-input',
      templateOptions: {
        attributes: { autocomplete: 'current-password' }, // this might be getting placed in the wrong spot (label instead?)
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        required: true,
      },
    },
    {
      key: 'rememberMe',
      type: 'checkbox',
      defaultValue: false,
      templateOptions: {
        label: 'Remember me?',
      },
    },
  ];

  onSubmit() {
    if (this.form.valid) {
      let loginRequestData: ILoginRequest = {
        username: this.form.value.username,
        password: this.form.value.password,
      };
      this.authService
        .login(loginRequestData, this.form.value.rememberMe)
        .subscribe({
          error: (err: HttpErrorResponse) => {
            this.notificationService.showError(err.error.message);
          },
        });
    }
  }

  // Things related to the password recovery modal

  forgotForm = new FormGroup({});
  forgotModel = {}; // apparently has to be of 'any' type
  forgotFields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        required: true,
      },
      className: 'd-block mb-2',
    },
  ];

  forgotPasswordModal: NgbModalRef; // this variable is assigned as soon as the modal is opened (return of the 'open' method)

  openForgotPasswordModal(content: any) {
    this.forgotPasswordModal = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });
  }

  onForgotPasswordSubmit() {
    if (this.forgotForm.valid) {
      this.authService
        .forgotPassword(this.forgotForm.value.email)
        .pipe(
          finalize(() => this.forgotPasswordModal.close('Finished process'))
        )
        .subscribe({
          next: () =>
            this.notificationService.showSuccess(
              'Instructions were sent to your email.'
            ),
          error: (err: HttpErrorResponse) =>
            this.notificationService.showError(
              err?.error?.message ??
                'An error occurred while resetting your password.'
            ),
        });
    }
  }
}
