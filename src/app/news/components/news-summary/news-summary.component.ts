import { Component, OnInit, Pipe } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../../models/news.model';
import { NewsListResponseModel } from '../../services/news.response.model';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.css'],
})
export class NewsSummaryComponent implements OnInit {
  public newsList: News[];
  public error?: Error;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsService
      .getNews(false)
      .subscribe((newsList) => (this.newsList = newsList));
  }
}
