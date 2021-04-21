import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from './news.service';
import { NewsSummaryComponent } from './news-summary/news-summary.component';



@NgModule({
  declarations: [
    NewsSummaryComponent
  ],
  providers: [
    NewsService
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NewsSummaryComponent
  ]
})
export class NewsModule { }
