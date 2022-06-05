import { Component, Inject, OnInit } from '@angular/core';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { News } from '../../models/news.model';
import { GenericNewsService, NewsService } from '../../services/news.service';
@Component({
  selector: 'app-news',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
})
export class NewsComponent {
  public newsList: News[];

  public routes: RouteMap[] = [{ label: 'Create News', route: '/news/create' }];

  constructor(    @Inject('GenericNewsService')private newsService: GenericNewsService) {
    this.newsService.getAll().subscribe((news) => {
      this.newsList = news;
    });
  }
}
