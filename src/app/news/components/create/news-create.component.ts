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

  editorType: CKEditor4.EditorType = CKEditor4.EditorType.CLASSIC;
  editorConfig: CKEditor4.Config = {
    toolbar: [
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
      {
        name: 'paragraph',
        items: [
          'NumberedList',
          'BulletedList',
          'Blockquote',
          'JustifyLeft',
          'JustifyCenter',
          'JustifyRight',
          'JustifyBlock',
          'Language',
        ],
      },
      { name: 'colors', items: ['TextColor', 'BGColor'] },
      { name: 'about', items: ['About'] },
    ],
  };

  constructor() {}

  onSubmit() {
    console.log(this.model);
  }
}
