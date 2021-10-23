import { Component, OnInit } from '@angular/core';
import { News } from '../news/models/news.model';
import { NewsService } from '../news/services/news.service';
import { RouteMap } from '../shared/models/route-map/route-map';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  news: News[];
  total: number;

  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  ngOnInit(): void {}

  constructor(public service: NewsService) {
    service.getAllNews().subscribe((res) => {
      this.news = res;
      this.total = this.news.length;
    });
  }
}
