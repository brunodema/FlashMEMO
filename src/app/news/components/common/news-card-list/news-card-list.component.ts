import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { News } from 'src/app/news/models/news.model';
import { GenericNewsService } from 'src/app/news/services/news.service';

@Component({
  selector: 'app-news-card-list',
  templateUrl: './news-card-list.component.html',
  styleUrls: ['./news-card-list.component.css'],
})
export class NewsCardListComponent {
  /**
   * News data associated with the component.
   */
  newsData: Array<News> = [];

  // properties to be used by the paginator
  pageEvent: PageEvent;
  defaultPageSize: number = 5;
  pageNumber: number; // the paginator widget uses '0' as the initial position (instead of '1')
  resultSize: number;
  totalAmount: number;

  @Output() deleteNews: EventEmitter<string> = new EventEmitter();

  constructor(
    @Inject('GenericNewsService') protected newsService: GenericNewsService
  ) {
    this.newsService
      .search({ pageNumber: 1, pageSize: this.defaultPageSize })
      .subscribe((response) => {
        this.newsData = response.data.results;
        this.pageNumber = Number(response.data.pageNumber) - 1;
        this.resultSize = Number(response.data.resultSize);
        this.totalAmount = Number(response.data.totalAmount);
      });
  }

  public getServerData(event: PageEvent) {
    event.pageIndex = event.pageIndex + 1;

    this.newsService
      .search({
        pageNumber: event?.pageIndex ?? 1,
        pageSize: event?.pageSize ?? this.defaultPageSize,
      })
      .subscribe((response) => {
        this.newsData = response.data.results;
        this.pageNumber = Number(response.data.pageNumber) - 1;
        this.resultSize = Number(response.data.resultSize);
        this.totalAmount = Number(response.data.totalAmount);
      });
    return event;
  }

  relayDelete(id: string) {
    this.deleteNews.emit(id);
  }
}
