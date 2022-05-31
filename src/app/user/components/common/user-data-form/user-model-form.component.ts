import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
          { name: 'fieldMatch', options: { errorPath: 'confirmPassword' } },
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
          key: 'confirmPassword',
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
    // this.form.controls['password'].setValue('', {
    //   emitEvent: false,
    //   onlySelf: true,
    // });
    // this.form.controls['confirmPassword'].setValue('', {
    //   emitEvent: false,
    //   onlySelf: true,
    // });
    this.form.patchValue({ password: '', confirmPassword: '' });
    this.cdr.detectChanges();
  }

  constructor(
    private authService: GenericAuthService,
    private userService: GenericUserService,
    private notificationService: GenericNotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    console.log('current mode is: ' + this.formMode);
    this.clearPasswordFields();
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.formMode === UserFormMode.EDIT) {
        this.userService.update(this.userModel.id, this.userModel).subscribe(
          (result) => {
            this.notificationService.showSuccess('User successfully updated!');
          },
          (error) => {
            this.notificationService.showError(error);
          }
        );
      } else {
        if (this.formMode === UserFormMode.REGISTER) {
          this.authService.register(this.form.value).subscribe(
            (result) => {
              this.notificationService.showSuccess(
                'User successfully registered!'
              );
            },
            (error) => {
              this.notificationService.showError(error);
            }
          );
        } else {
          this.userService.create(this.form.value).subscribe(
            (result) => {
              this.notificationService.showSuccess(
                'User successfully created!'
              );
              this.router.navigate(['user', result.data]);
            },
            (error) => {
              this.notificationService.showError(error);
            }
          );
        }
      }

      return;
    }
    this.notificationService.showWarning('The form has problems.');
  }
}
