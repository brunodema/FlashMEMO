import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from './services/news.service';
import { NewsRoutingModule } from './news-routing.module';
import { NewsSummaryComponent } from './components/news-summary/news-summary.component';
import { NewsComponent } from './news.component';
import { NewsCreateComponent } from './create/news-create.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';



@NgModule({
  declarations: [
    NewsSummaryComponent,
    NewsComponent,
    NewsCreateComponent
  ],
  providers: [
    NewsService
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
    CKEditorModule
  ],
  exports: [
    NewsSummaryComponent
  ]
})
export class NewsModule { }
