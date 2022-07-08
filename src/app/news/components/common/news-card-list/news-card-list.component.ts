import { Component, Inject, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ExtendedNews } from 'src/app/news/models/news.model';
import { GenericNewsService } from 'src/app/news/services/news.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import {
  GenericSpinnerService,
  SpinnerType,
} from 'src/app/shared/services/UI/spinner.service';
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
  extendedNewsData: Array<ExtendedNews> = [];

  // properties to be used by the paginator
  pageEvent: PageEvent;
  pageNumber: number; // the paginator widget uses '0' as the initial position (instead of '1')
  pageSize: number; //
  totalAmount: number;

  constructor(
    @Inject('GenericNewsService') protected newsService: GenericNewsService,
    @Inject('GenericUserService') protected userService: GenericUserService,
    @Inject('GenericNotificationService')
    protected notificationService: GenericNotificationService,
    @Inject('GenericSpinnerService')
    protected spinnerService: GenericSpinnerService
  ) {}

  private refreshNewsSource(pageSize: number, pageNumber: number) {
    this.spinnerService.showSpinner(SpinnerType.LOADING);

    this.newsService.getExtendedLatestNews(pageSize, pageNumber).subscribe({
      next: (response) => {
        this.extendedNewsData = response.data.results;
        this.pageNumber = Number(response.data.pageNumber) - 1;
        this.pageSize = this.pageSizeOptions[0];
        this.totalAmount = Number(response.data.totalAmount);
      },
      complete: () => this.spinnerService.hideSpinner(SpinnerType.LOADING),
    });
  }

  ngOnInit(): void {
    // wow, 'OnInit' is actually useful! :O
    this.refreshNewsSource(this.pageSizeOptions[0], 1);
  }

  public getServerData(event: PageEvent) {
    event.pageIndex = event.pageIndex + 1;

    this.refreshNewsSource(
      event?.pageSize ?? this.pageSizeOptions[0],
      event?.pageIndex ?? 1
    );

    return event;
  }

  deleteNews(id: string) {
    if (confirm('Are you sure you want to delete this News?')) {
      this.newsService.delete(id).subscribe((response) => {
        this.notificationService.showSuccess('News successfully deleted.');
        this.refreshNewsSource(this.pageSize, 1);
      });
    }
  }
}
