import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailViewComponent } from 'src/app/shared/components/common/detail-view/detail-view.component';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
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

  constructor(
    @Inject('GenericNewsService')
    protected newsService: GenericNewsService,
    @Inject('GenericAuthService')
    protected authService: GenericAuthService,
    protected notificationService: GenericNotificationService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(route, newsService);

    if (!this.model) {
      this.model = new News();
    }

    this.model.ownerId = this.authService.loggedUserId.getValue();
  }
  ngAfterViewInit(): void {
    // CKEditor is bugged when it comes to having an editor inside a MatTabGroup. If I set the other tab as default (form hidden at first), an error will be thrown and no content will be set to the editor. Even though it's stated that a fix for it exists, it doesn't work on multiple reloads (ex: browsing news 'list' view and selecting different News there). The issue is mentioned on many places, like here: https://github.com/ckeditor/ckeditor4-angular/issues/114. For the first time, I couldn't find an actual solution for this - maybe ditching the MatTabGroup? For now, I'll leave the form view as the default, since no problems occur when set like this. I nthe future, I'll probably will still need a 'detail' view for News so those tabs aren't show for a normal user.

    // UPDATE: Using the lazy loading described in the Angular Material documentation (https://material.angular.io/components/tabs/overview#lazy-loading) fixes the CKEditor content problems, BUT keeps the exception on the console. I guess I'll have to live with this error being thrown...
    if (this.model.newsId.length > 0) {
      this.tabGroup.selectedIndex = 1;
    } else {
      this.tabGroup.selectedIndex = 0;
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
