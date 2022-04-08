import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './routing/user-routing.module';
import { UserCreateComponent } from './components/create/user-create.component';
import { SharedModule } from '../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { RegistrationFormComponent } from './components/create/registration-form/registration-form.component';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    RegistrationFormComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forChild(),
    FormlyBootstrapModule,
    SharedModule,
    FormsModule,
  ],
})
export class UserModule {}
