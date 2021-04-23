import { Component, OnInit } from '@angular/core';
import { RouteMap } from '../shared/models/route-map/route-map';
import { News } from './models/news.model';
import { NewsService } from './services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public newsList : News[] = [];
  public error? : Error;

  routes : RouteMap[] = [
    {label: "Create News", route: "create"}
  ]

  constructor(private newsService : NewsService) { }

  ngOnInit() {
    this.newsService.getNews()
      .subscribe(
        news => {
          this.newsList = news.sort((i1, i2) => i2.creationDate - i1.creationDate);
        },
        error => {
          this.error = error;
          console.log(this.error);
        }
      );
  }
}
