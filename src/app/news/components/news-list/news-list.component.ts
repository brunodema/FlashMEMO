import { Component, OnInit } from '@angular/core';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { News } from '../../models/news.model';
import { NewsService } from '../../services/news.service';
@Component({
  selector: 'app-news',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
})
export class NewsComponent implements OnInit {
  public newsList: News[];
  public error?: Error;

  routes: RouteMap[] = [{ label: 'Create News', route: 'create' }];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.getAll().subscribe((news) => {
      this.newsList = news;
      console.log(news);
    });
  }
}
