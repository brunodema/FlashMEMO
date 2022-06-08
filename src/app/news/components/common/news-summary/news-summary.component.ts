import { Component, Inject, OnInit, Pipe } from '@angular/core';
import { News } from '../../../models/news.model';
import {
  GenericNewsService,
  NewsService,
} from '../../../services/news.service';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.css'],
})
export class NewsSummaryComponent implements OnInit {
  public newsList: News[];

  constructor(
    @Inject('GenericNewsService') private newsService: GenericNewsService
  ) {}

  ngOnInit() {
    this.newsService.getLatestNews(4).subscribe((latestNews) => {
      this.newsList = latestNews;
    });
  }
}
