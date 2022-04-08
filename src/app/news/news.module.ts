import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRoutingModule } from './routing/news-routing.module';
import { NewsSummaryComponent } from './components/news-summary/news-summary.component';
import { NewsCreateComponent } from './components/create/news-create.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { SharedModule } from '../shared/shared.module';
import { NewsComponent } from './components/news-list/news-list.component';

@NgModule({
  declarations: [
    NewsSummaryComponent,
    NewsComponent,
    NewsCreateComponent,
    NewsCardComponent,
  ],
  imports: [CommonModule, NewsRoutingModule, CKEditorModule, SharedModule],
  exports: [NewsSummaryComponent],
})
export class NewsModule {}
