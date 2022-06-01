import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRoutingModule } from './routing/news-routing.module';
import { NewsSummaryComponent } from './components/news-summary/news-summary.component';
import { NewsCreateComponent } from './components/create/news-create.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { SharedModule } from '../shared/shared.module';
import { NewsComponent } from './components/news-list/news-list.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';

@NgModule({
  declarations: [
    NewsSummaryComponent,
    NewsComponent,
    NewsCreateComponent,
    NewsCardComponent,
    NewsDetailComponent,
  ],
  imports: [CommonModule, NewsRoutingModule, SharedModule],
  exports: [NewsSummaryComponent],
})
export class NewsModule {}
