import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../components/default/default.component';

const routes: Routes = [
  { path: 'default', component: DefaultComponent },
  { path: '', redirectTo: 'default', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {}
