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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
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
    },
    {
      validators: {
        validation: [
          { name: 'fieldMatch', options: { errorPath: 'passwordConfirm' } },
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
    private notificationService: GenericNotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {
    console.log(this.formMode);
  }
  ngAfterViewInit(): void {
    this.clearPasswordFields();
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.formMode === UserFormMode.EDIT) {
        this.userService
          .update(this.userModel.id, this.userModel)
          .subscribe((result) => {
            this.notificationService.showSuccess('User successfully updated!');
          });
      } else {
        if (this.formMode === UserFormMode.REGISTER) {
          this.authService.register(this.form.value).subscribe({
            next: (result) => {
              this.openFlashcardModal();
            },
            error: (error: HttpErrorResponse) => {
              this.notificationService.showError(error.error.message);
            },
          });
        } else {
          // This is used when an admin user is creating a new user manually
          this.userService.create(this.form.value).subscribe((result) => {
            this.notificationService.showSuccess('User successfully created!');
            this.router.navigate(['user', result.data]);
          });
        }
      }

      return;
    }
    this.notificationService.showWarning('The form has problems.');
  }

  @ViewChild('registrationConfirmModal')
  registrationConfirmModal: NgbModalRef; // this variable is assigned as soon as the modal is opened (return of the 'open' method)

  openFlashcardModal() {
    this.registrationConfirmModal = this.modalService.open(
      this.registrationConfirmModal,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      }
    );
  }
}
