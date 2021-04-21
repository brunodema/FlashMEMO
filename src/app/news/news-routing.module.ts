import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsCreateComponent } from './create/news-create.component';
import { NewsComponent } from './news.component';

const routes: Routes = [
  {path: '', component: NewsComponent},
  {path: 'create', component: NewsCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
