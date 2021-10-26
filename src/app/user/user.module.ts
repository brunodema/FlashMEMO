import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserCreateComponent } from './create/user-create.component';
import { SharedModule } from '../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { RegistrationFormComponent } from './create/registration-form/registration-form.component';
import { NewsService } from '../news/services/news.service';
import { DataTableService } from '../shared/models/DataTableService';
import { News } from '../news/models/news.model';

@NgModule({
  declarations: [UserComponent, UserCreateComponent, RegistrationFormComponent],
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
