import { Component, Inject } from '@angular/core';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { GenericNewsService } from '../../services/news.service';
@Component({
  selector: 'app-news',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
})
export class NewsComponent {
  public routes: RouteMap[] = [{ label: 'Create News', route: '/news/create' }];

  constructor(
    @Inject('GenericNewsService') protected newsService: GenericNewsService,
    @Inject('GenericAuthService') public authService: GenericAuthService,
    @Inject('GenericNotificationService')
    protected notificationService: GenericNotificationService
  ) {}
}
