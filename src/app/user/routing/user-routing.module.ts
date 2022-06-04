import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRepositoryResolverService } from 'src/app/shared/resolvers/generic-repository.resolver';
import { UserCreateComponent } from '../components/create/user-create.component';
import { UserDetailComponent } from '../components/user-detail/user-detail.component';
import { UserListComponent } from '../components/user-list/user-list.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'create', component: UserCreateComponent },
  {
    path: ':id',
    component: UserDetailComponent,
    resolve: { user: UserRepositoryResolverService },
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
