import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRoutingModule } from './routing/news-routing.module';
import { NewsSummaryComponent } from './components/news-summary/news-summary.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { SharedModule } from '../shared/shared.module';
import { NewsComponent } from './components/news-list/news-list.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { NewsPreviewComponent } from './components/common/news-preview/news-preview.component';
import { NewsFormComponent } from './components/common/news-form/news-form.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { NewsCardListComponent } from './components/common/news-card-list/news-card-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    NewsSummaryComponent,
    NewsComponent,
    NewsCardComponent,
    NewsDetailComponent,
    NewsFormComponent,
    NewsPreviewComponent,
    NewsCardListComponent,
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
    SharedModule,
    CKEditorModule,
    FormsModule,
    MatTabsModule,
    NgbTooltipModule,
    MatPaginatorModule,
  ],
  exports: [NewsSummaryComponent, NewsCardListComponent],
})
export class NewsModule {}
