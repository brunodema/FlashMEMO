import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashMEMOAuthGuard } from 'src/app/shared/guards/auth.guard';
import { UserRepositoryResolverService } from 'src/app/shared/resolvers/generic-repository.resolver';
import { UserCreateComponent } from '../components/create/user-create.component';
import { UserDetailComponent } from '../components/user-detail/user-detail.component';
import { UserListComponent } from '../components/user-list/user-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: UserListComponent,
    canActivate: [FlashMEMOAuthGuard],
  },
  {
    path: 'create',
    component: UserCreateComponent,
    canActivate: [FlashMEMOAuthGuard],
  },
  {
    path: ':id',
    component: UserDetailComponent,
    resolve: { user: UserRepositoryResolverService },
    canActivate: [FlashMEMOAuthGuard],
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
