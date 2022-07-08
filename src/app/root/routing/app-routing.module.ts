import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { MethodComponent } from '../components/method/method.component';
import { ActivateAccountComponent } from '../components/activate-account/activate-account.component';
import { PasswordResetComponent } from '../components/password-reset/password-reset.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'method', component: MethodComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  {
    path: 'news',
    loadChildren: () =>
      import('../../news/news.module').then((m) => m.NewsModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('../../user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'deck',
    loadChildren: () =>
      import('../../deck/deck.module').then((m) => m.DeckModule),
  },
  {
    path: 'test',
    loadChildren: () =>
      import('../../test/test.module').then((m) => m.TestModule),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
