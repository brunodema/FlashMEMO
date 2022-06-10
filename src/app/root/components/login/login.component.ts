import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ILoginRequest } from '../../../shared/models/http/http-request-types';
import { GenericAuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
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
  ];

  constructor(
    @Inject('GenericAuthService') private authService: GenericAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.valid) {
      let loginRequestData: ILoginRequest = {
        username: this.form.value.username,
        password: this.form.value.password,
      };
      this.authService.login(loginRequestData).subscribe();
    }
  }
}
