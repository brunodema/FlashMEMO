import { Component, OnInit } from '@angular/core';
import { CKEditor4 } from 'ckeditor4-angular';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-news-create',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.css'],
})
export class NewsCreateComponent {
  /**
   * Model used to setup the new News object.
   */
  model: News = new News();

  constructor() {}
}
