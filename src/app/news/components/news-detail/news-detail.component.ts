import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular';
import { DetailViewComponent } from 'src/app/shared/components/common/detail-view/detail-view.component';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { News } from '../../models/news.model';
import { GenericNewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css'],
})
export class NewsDetailComponent
  extends DetailViewComponent<News>
  implements AfterViewInit
{
  /**
   * Handler to access the MatTabGroup from the screen ('create' and 'preview' tabs).
   */
  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;

  /**
   * Determines if the view will show the preview for an existing news upon opening or not.
   */
  protected isNewNews: boolean = true;

  constructor(
    @Inject('GenericNewsService')
    protected service: GenericNewsService,
    protected notificationService: GenericNotificationService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(route, service);

    if (!this.model) {
      this.model = new News();
    } else {
      this.isNewNews = false;
    }
  }
  ngAfterViewInit(): void {
    if (this.isNewNews) {
      this.tabGroup.selectedIndex = 0;
    } else {
      this.tabGroup.selectedIndex = 1;
    }
  }

  onSubmit(args: News) {
    if (args.newsId.trim().length > 0) {
      this.service.update(args.newsId, args).subscribe((response) => {
        this.notificationService.showSuccess('News successfully updated.');
      });
    } else {
      this.service.create(args).subscribe((response) => {
        this.notificationService.showSuccess('News successfully created.');
        this.router.navigate(['/news', response.data]);
      });
    }
  }

  isNewsValid() {
    return this.model.title && this.model.subtitle && this.model.content;
  }
}
