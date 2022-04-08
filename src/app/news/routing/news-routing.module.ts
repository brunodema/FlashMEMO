import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsCreateComponent } from '../components/create/news-create.component';
import { NewsComponent } from '../components/news-list/news-list.component';

const routes: Routes = [
  { path: '', component: NewsComponent },
  { path: 'create', component: NewsCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
