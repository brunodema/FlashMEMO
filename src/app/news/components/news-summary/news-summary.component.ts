import { Component, OnInit, Pipe } from '@angular/core';
import { News } from '../../models/news.model';
import { GenericNewsService, NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.css'],
})
export class NewsSummaryComponent implements OnInit {
  public newsList: News[];
  public error?: Error;

  constructor(private newsService: GenericNewsService) {}

  ngOnInit() {
    this.newsService
      .getAll()
      .subscribe((newsList) => (this.newsList = newsList));
  }
}
