import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { finalize } from 'rxjs';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import {
  GenericSpinnerService,
  SpinnerType,
} from 'src/app/shared/services/UI/spinner.service';
import { User } from 'src/app/user/models/user.model';
import { GenericUserService } from 'src/app/user/services/user.service';

/**
 * This is used to differentiate between the following possibilities: (a) sysadmin is creating a new user from scratch, (b) sysadmin/user is editting its profile, and (c) a visitor is registering his/hers account on the website.
 */
export enum UserFormMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  REGISTER = 'REGISTER',
}

@Component({
  selector: 'app-user-model-form',
  templateUrl: './user-model-form.component.html',
  styleUrls: ['./user-model-form.component.css'],
})
export class UserModelFormComponent implements AfterViewInit {
  @Input()
  formMode: UserFormMode = UserFormMode.REGISTER;

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          // id is not necessary
          key: 'name',
          type: 'input',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter your name',
            required: true,
          },
          className: 'd-block mb-2',
        },
        {
          key: 'surname',
          type: 'input',
          templateOptions: {
            label: 'Surname',
            placeholder: 'Enter your last name',
            required: true,
          },
          className: 'd-block mb-2',
        },
        {
          key: 'username',
          type: 'input',
          templateOptions: {
            label: 'Username',
            placeholder: 'Enter a unique username',
            required: true,
          },
          className: 'd-block mb-2',
        },
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
          validators: {
            validation: ['email'],
          },
        },
        {
          validators: {
            validation: [
              {
                name: 'passwordMatch',
                options: { errorPath: 'passwordConfirm' },
              },
            ],
          },
          fieldGroup: [
            {
              key: 'password',
              type: 'input',
              templateOptions: {
                type: 'password',
                label: 'Password',
                placeholder: 'Enter your password',
              },
              validators: {
                validation: ['passwordRequirements'],
              },
              className: 'd-block mb-2',
              expressionProperties: {
                'templateOptions.required': (model: User, formState: any) => {
                  return this.formMode === UserFormMode.EDIT ? false : true;
                },
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
      ],
    },
    {
      // Below, properties only seen by sysadmins
      hide: !this.authService.isLoggedUserAdmin(),
      fieldGroup: [
        {
          key: 'lockoutEnabled',
          type: 'checkbox',
          defaultValue: false,
          templateOptions: {
            label: 'Is user locked?',
          },
          className: 'd-block mb-2',
        },
        {
          // Now, you might be asking yourselves: why the fuck is this random 'fieldGroup' alone here? The anwser: for some reason, the 'hideExpression' property only works when I apply them to a 'fieldGroup', and not to an indiviual field - even though the property is there to be set. Hence this atrocity over here...
          hideExpression: (model, fs, field) => {
            let hide = !model.lockoutEnabled;
            if (hide) {
              field!.model.lockoutEnd = undefined;
            }
            return !model.lockoutEnabled;
          },
          fieldGroup: [
            {
              key: 'lockoutEnd',
              type: 'input',
              templateOptions: {
                label: 'End',
                type: 'date',
              },
              className: 'd-block mb-2',
              validators: {
                validation: ['date-future'],
              },
            },
          ],
        },
        {
          key: 'emailConfirmed',
          type: 'checkbox',
          defaultValue: false,
          templateOptions: {
            label: 'Confirmed email?',
          },
          className: 'd-block mb-2',
        },
      ],
    },
  ];

  @Input()
  userModel: User = {} as User; // apparently has to be of 'any' type

  /**
   * To avoid any risks of exposing confidential information (even if masked), this function is called to clear both password fields of the form.
   */
  private clearPasswordFields() {
    this.form.patchValue({ password: '', confirmPassword: '' });
    this.cdr.detectChanges();
  }

  constructor(
    @Inject('GenericAuthService')
    private authService: GenericAuthService,
    @Inject('GenericUserService') private userService: GenericUserService,
    @Inject('GenericNotificationService')
    private notificationService: GenericNotificationService,
    @Inject('GenericSpinnerService')
    private spinnerService: GenericSpinnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}
  ngAfterViewInit(): void {
    this.clearPasswordFields();
  }

  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.showSpinner(SpinnerType.LOADING);
      if (this.formMode === UserFormMode.EDIT) {
        this.userService
          .update(this.userModel.id, this.userModel)
          .pipe(
            finalize(() => this.spinnerService.hideSpinner(SpinnerType.LOADING))
          )
          .subscribe((result) => {
            this.notificationService.showSuccess('User successfully updated!');
          });
      } else {
        if (this.formMode === UserFormMode.REGISTER) {
          this.authService
            .register(this.form.value)
            .pipe(
              finalize(() =>
                this.spinnerService.hideSpinner(SpinnerType.LOADING)
              )
            )
            .subscribe({
              next: (result) => {
                this.openFlashcardModal();
              },
              error: (error: HttpErrorResponse) => {
                this.notificationService.showError(error.error.message);
              },
            });
        } else {
          // This is used when an admin user is creating a new user manually
          this.userService
            .create(this.form.value)
            .pipe(
              finalize(() =>
                this.spinnerService.hideSpinner(SpinnerType.LOADING)
              )
            )
            .subscribe((result) => {
              this.notificationService.showSuccess(
                'User successfully created!'
              );
              this.router.navigate(['user', result.data]);
            });
        }
      }
      return;
    }
    this.notificationService.showWarning('The form has problems.');
  }

  @ViewChild('registrationConfirmModal')
  registrationConfirmModal: any; // For some fucking reason, declaring this as 'any' is way safer when programatically using the 'open' method from the modal services.

  openFlashcardModal() {
    this.registrationConfirmModal = this.modalService.open(
      this.registrationConfirmModal,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      }
    );

    this.registrationConfirmModal.result.finally(() =>
      this.router.navigateByUrl('/login')
    );
  }
}
