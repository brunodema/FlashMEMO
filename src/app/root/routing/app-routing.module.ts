import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { FlashMEMOAuthGuard } from '../../shared/guards/auth.guard';
import { HomeComponent } from '../components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
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
    canActivate: [FlashMEMOAuthGuard],
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
