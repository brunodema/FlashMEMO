import { Component, Input, OnInit } from '@angular/core';
import { News } from 'src/app/news/models/news.model';

@Component({
  selector: 'app-news-preview',
  templateUrl: './news-preview.component.html',
  styleUrls: ['./news-preview.component.css']
})
export class NewsPreviewComponent {

  /**
   * Model used to setup the new News object.
   */
  @Input()
  model: News = new News();

  constructor() { }
}
