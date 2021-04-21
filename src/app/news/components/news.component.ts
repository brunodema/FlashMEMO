import { Component, OnInit } from '@angular/core';
import { News } from '../models/news.model';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public news : News[] = [];
  public error? : Error;

  constructor(private newsService : NewsService) { }

  ngOnInit() {
    this.newsService.getNews()
      .subscribe(
        news => {
          this.news = news;
        },
        error => {
          this.error = error;
          console.log(this.error);
        }
      );
  }
}
