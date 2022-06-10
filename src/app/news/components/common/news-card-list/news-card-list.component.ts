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
import { IPaginatedListResponse } from 'src/app/shared/models/http/http-response-types';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { User } from 'src/app/user/models/user.model';
import { GenericUserService } from 'src/app/user/services/user.service';

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

  /**
   * Info associated with user who posted each News.
   */
  ownerData: Array<User> = [];

  // properties to be used by the paginator
  pageEvent: PageEvent;
  pageNumber: number; // the paginator widget uses '0' as the initial position (instead of '1')
  pageSize: number; //
  totalAmount: number;

  constructor(
    @Inject('GenericNewsService') protected newsService: GenericNewsService,
    @Inject('GenericUserService') protected userService: GenericUserService,
    protected notificationService: GenericNotificationService
  ) {}

  private refreshOwnerInfo(response: IPaginatedListResponse<News>) {
    this.ownerData = [];

    response.data.results.forEach((news) => {
      this.userService.get(news.ownerId).subscribe((getResponse) => {
        this.ownerData.push(getResponse.data);
      });
    });
  }

  private refreshNewsSource(pageNumber: number, pageSize: number) {
    this.newsService
      .search({
        pageNumber: pageNumber,
        pageSize: pageSize,
        columnToSort: 'creationDate',
        sortType: 'descending',
      })
      .subscribe((response) => {
        this.refreshOwnerInfo(response);

        this.newsData = response.data.results;
        this.pageNumber = Number(response.data.pageNumber) - 1;
        this.pageSize = this.pageSizeOptions[0];
        this.totalAmount = Number(response.data.totalAmount);
      });
  }

  ngOnInit(): void {
    // wow, 'OnInit' is actually useful! :O
    this.refreshNewsSource(1, this.pageSizeOptions[0]);
  }

  public getServerData(event: PageEvent) {
    event.pageIndex = event.pageIndex + 1;

    this.refreshNewsSource(
      event?.pageIndex ?? 1,
      event?.pageSize ?? this.pageSizeOptions[0]
    );

    return event;
  }

  deleteNews(id: string) {
    if (confirm('Are you sure you want to delete this News?')) {
      this.newsService.delete(id).subscribe((response) => {
        this.notificationService.showSuccess('News successfully deleted.');
        this.refreshNewsSource(1, this.pageSize);
      });
    }
  }
}
