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

@Component({
  selector: 'app-user-model-form',
  templateUrl: './user-model-form.component.html',
  styleUrls: ['./user-model-form.component.css'],
})
export class UserModelFormComponent implements AfterViewInit {
  /**
   * Will be true if a user is provided in the declaration of the component, meaning that an existing user is being shown by the component.
   */
  isEditMode: boolean = false;

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
            required: true,
          },
          className: 'd-block mb-2',
        },
        {
          key: 'confirmPassword',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Confirm password',
            placeholder: 'Repeat your password',
            required: true,
          },
        },
      ],
    },
  ];

  @Input()
  userModel: User = {} as User; // apparently has to be of 'any' type

  constructor(
    private authService: GenericAuthService,
    private userService: GenericUserService,
    private notificationService: GenericNotificationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.userModel = this.route.snapshot.data['user'];
    if (this.userModel) this.isEditMode = true;
  }
  ngAfterViewInit(): void {
    if (this.userModel) {
      this.form.controls['password'].setValue('');
      this.cdr.detectChanges();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.isEditMode) {
        this.userService.update(this.userModel.id, this.userModel).subscribe(
          (result) => {
            this.notificationService.showSuccess('User successfully updated!');
          },
          (error) => {
            this.notificationService.showError(error);
          }
        );
      } else {
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
      }

      return;
    }
    console.log('form is not valid!');
  }
}
