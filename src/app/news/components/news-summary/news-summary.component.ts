import { Component, OnInit, Pipe } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../../models/news.model';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.css'],
})
export class NewsSummaryComponent implements OnInit {
  public newsList$: Observable<News[]>;
  public error?: Error;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsList$ = this.newsService.getNews();
  }
}
