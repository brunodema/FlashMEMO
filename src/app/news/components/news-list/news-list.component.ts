import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { News } from '../../models/news.model';
import { GenericNewsService, NewsService } from '../../services/news.service';
@Component({
  selector: 'app-news',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
})
export class NewsComponent {
  newsData$ = new BehaviorSubject<News[]>([]);
  refreshDeckDataSource() {
    this.newsService.getAll().subscribe((newsArray) => {
      this.newsData$.next(newsArray);
    });
  }

  public routes: RouteMap[] = [{ label: 'Create News', route: '/news/create' }];

  constructor(
    @Inject('GenericNewsService') protected newsService: GenericNewsService,
    protected notificationService: GenericNotificationService
  ) {
    this.refreshDeckDataSource();
  }

  deleteNews(event: string) {
    if (confirm('Are you sure you want to delete this News?')) {
      this.newsService.delete(event).subscribe((response) => {
        this.notificationService.showSuccess('News successfully deleted.');
        this.refreshDeckDataSource();
      });
    }
  }
}
