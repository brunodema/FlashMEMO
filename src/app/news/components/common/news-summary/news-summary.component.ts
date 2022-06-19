import { Component, Inject, OnInit } from '@angular/core';
import {
  GenericSpinnerService,
  SpinnerType,
} from 'src/app/shared/services/UI/spinner.service';
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
    @Inject('GenericNewsService') private newsService: GenericNewsService,
    @Inject('GenericSpinnerService')
    private spinnerService: GenericSpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.showSpinner(SpinnerType.LOADING);

    this.newsService.getExtendedLatestNews(4, 1).subscribe({
      next: (latestNews) => {
        this.newsList = latestNews.data.results;
      },
      complete: () => this.spinnerService.hideSpinner(SpinnerType.LOADING),
    });
  }
}
