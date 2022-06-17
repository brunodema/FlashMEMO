import { Component, Inject, OnInit } from '@angular/core';
import { ExtendedNews } from '../../../models/news.model';
import { GenericNewsService } from '../../../services/news.service';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.css'],
})
export class NewsSummaryComponent implements OnInit {
  public newsList: ExtendedNews[] = [];

  constructor(
    @Inject('GenericNewsService') private newsService: GenericNewsService
  ) {}

  ngOnInit() {
    this.newsService.getExtendedLatestNews(4, 1).subscribe((latestNews) => {
      this.newsList = latestNews.data.results;
    });
  }
}
