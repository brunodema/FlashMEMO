import { Component, Inject, OnInit, Pipe } from '@angular/core';
import { User } from 'src/app/user/models/user.model';
import { GenericUserService } from 'src/app/user/services/user.service';
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
  public newsList: News[] = [];
  public ownerInfo: User[] = [];

  constructor(
    @Inject('GenericNewsService') private newsService: GenericNewsService,
    @Inject('GenericUserService') private userService: GenericUserService
  ) {}

  ngOnInit() {
    this.newsService.getLatestNews(4).subscribe((latestNews) => {
      latestNews.forEach((news) => {
        this.userService.get(news.ownerId).subscribe((getResponse) => {
          this.ownerInfo.push(getResponse.data); // no need to reset array here because it is not updated automatically like in other components
        });
      });
      this.newsList = latestNews;
    });
  }
}
