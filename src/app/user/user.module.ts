import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserCreateComponent } from './create/user-create.component';
import { SharedModule } from '../shared/shared.module';

import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { RegistrationFormComponent } from './create/registration-form/registration-form.component';


export function fieldMatchValidator(control: AbstractControl) {
  const { password, passwordConfirm } = control.value;

  // avoid displaying the message error when values are empty
  if (!passwordConfirm || !password) {
    return null;
  }

  if (passwordConfirm === password) {
    return null;
  }

  return { fieldMatch: { message: 'Password Not Matching' } };
}

const config : ConfigOption = {
  validationMessages: [
    { name: 'required', message: 'This field is required' },
    { name: 'emailIsValid', message: 'This is not a valid email' },
    { name: 'passwordMatch', message: 'The password must match' },
  ],
  validators: [
    { name: 'fieldMatch', validation: fieldMatchValidator },
  ],
}


@NgModule({
  declarations: [
    UserComponent,
    UserCreateComponent,
    RegistrationFormComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forChild(config),
    FormlyBootstrapModule,
    SharedModule
  ]
})
export class UserModule { }
