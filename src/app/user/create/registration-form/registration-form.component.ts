import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { LoginRequestModel } from 'src/app/shared/models/api-response';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent implements OnInit {
  form = new FormGroup({});
  model = {}; // apparently has to be of 'any' type
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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe(
        (result) => {
          console.log('user successfully registered!');
        },
        (error) => {
          console.log(error);
        }
      );

      return;
    }
    console.log('form is not valid!');
  }
}
