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

@NgModule({
  declarations: [UserComponent, UserCreateComponent, RegistrationFormComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forChild(),
    FormlyBootstrapModule,
    SharedModule,
  ],
})
export class UserModule {}
