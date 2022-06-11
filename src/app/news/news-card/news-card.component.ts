import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/user/models/user.model';
import { ExtendedNews, News } from '../models/news.model';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css'],
})
export class NewsCardComponent {
  @Input() extendedNews: ExtendedNews = new ExtendedNews();

  @Output() delete: EventEmitter<any> = new EventEmitter();

  constructor() {}

  deleteClick() {
    this.delete.emit(this.extendedNews.newsId);
  }
}
