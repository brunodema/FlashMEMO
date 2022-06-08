import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { News } from 'src/app/news/models/news.model';
import { GenericNewsService } from 'src/app/news/services/news.service';

@Component({
  selector: 'app-news-card-list',
  templateUrl: './news-card-list.component.html',
  styleUrls: ['./news-card-list.component.css'],
})
export class NewsCardListComponent implements OnInit {
  /**
   * Parameter used by the paginator to setup the page size options.
   */
  @Input()
  pageSizeOptions: Array<number> = [];

  /**
   * News data associated with the component.
   */
  newsData: Array<News> = [];

  // properties to be used by the paginator
  pageEvent: PageEvent;
  pageNumber: number; // the paginator widget uses '0' as the initial position (instead of '1')
  resultSize: number;
  totalAmount: number;

  @Output() deleteNews: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    @Inject('GenericNewsService') protected newsService: GenericNewsService
  ) {}

  ngOnInit(): void {
    // wow, 'OnInit' is actually useful! :O
    this.newsService
      .search({
        pageNumber: 1,
        pageSize: this.pageSizeOptions[0],
        columnToSort: 'creationDate',
        sortType: 'desc',
      })
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
        pageSize: event?.pageSize ?? this.pageSizeOptions[0],
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
