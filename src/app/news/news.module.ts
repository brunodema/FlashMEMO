import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from './services/news.service';
import { NewsRoutingModule } from './news-routing.module';
import { NewsSummaryComponent } from './components/news-summary/news-summary.component';
import { NewsComponent } from './news.component';



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
