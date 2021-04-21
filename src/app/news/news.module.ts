import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsSummaryComponent } from './news-summary/news-summary.component';
import { NewsComponent } from './news.component';
import { NewsService } from './news.service';
import { NewsRoutingModule } from './news-routing.module';



@NgModule({
  declarations: [
    NewsSummaryComponent,
    NewsComponent
  ],
  providers: [
    NewsService
  ],
  imports: [
    CommonModule,
    NewsRoutingModule
  ],
  exports: [
    NewsSummaryComponent
  ]
})
export class NewsModule { }
