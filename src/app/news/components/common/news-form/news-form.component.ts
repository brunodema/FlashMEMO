import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CKEditor4 } from 'ckeditor4-angular';
import { News } from 'src/app/news/models/news.model';

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.css']
})
export class NewsFormComponent {

  /**
   * Model used to setup the new News object.
   */
  @Input()
  model: News = new News();

  @Output()
  submit : EventEmitter<News> = new EventEmitter()

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

  constructor() { }

  onSubmit() {
    console.log(this.model);
    this.submit.emit(this.model)
  }
}
