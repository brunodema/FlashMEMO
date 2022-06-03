import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { News } from '../../models/news.model';
import { GenericNewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-create',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.css'],
})
export class NewsCreateComponent {
  /**
   * Model used to setup the new News object.
   */
  model: News = new News();

  constructor(
    private service: GenericNewsService,
    private notificationService: GenericNotificationService,
    private router: Router
  ) {}

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
}
