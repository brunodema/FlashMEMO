import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './components/news.component';
import { NewsService } from './services/news.service';
import { NewsRoutingModule } from './news-routing.module';
import { NewsSummaryComponent } from './components/news-summary/news-summary.component';



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
