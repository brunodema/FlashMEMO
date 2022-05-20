import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './routing/user-routing.module';
import { UserCreateComponent } from './components/create/user-create.component';
import { SharedModule } from '../shared/shared.module';
import { FormlyModule } from '@ngx-formly/core';
import { UserModelFormComponent } from './components/common/user-data-form/user-model-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserModelFormComponent,
    UserDetailComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forChild(),
    FormlyMaterialModule,
    SharedModule,
    FormsModule,
  ],
})
export class UserModule {}
