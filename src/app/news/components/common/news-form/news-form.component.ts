import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CKEditor4 } from 'ckeditor4-angular';
import { News } from 'src/app/news/models/news.model';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.css'],
})
export class NewsFormComponent {
  /**
   * Model used to setup the new News object.
   */
  @Input()
  model: News = new News();

  /**
   * Emit event stating the the news model from the form is ready for further processing (ex: CRUD).
   */
  @Output()
  submit: EventEmitter<News> = new EventEmitter();

  editorType: CKEditor4.EditorType = CKEditor4.EditorType.CLASSIC;
  editorConfig: CKEditor4.Config = {
    delayIfDetached: true,
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

  /**
   * Determines if the 'preview' section is shown to the user or not.
   */
  public showImagePreview: boolean = false;

  /**
   * Handle to access the image preview widget on the form.
   */
  @ViewChild('imagePreview') imagePreview: ElementRef<any>;

  constructor(
    protected notificationService: GenericNotificationService,
    protected crd: ChangeDetectorRef
  ) {
    this.showImagePreview = this.model.thumbnailPath.trim().length > 0;
  }

  onSubmit() {
    this.submit.emit(this.model);
  }

  processThumbnailURL() {
    this.showImagePreview = true;
    this.crd.detectChanges();
    this.imagePreview.nativeElement.src = this.model.thumbnailPath;
  }

  brokenImage() {
    this.showImagePreview = false;
    this.notificationService.showError(
      'The provided URL does not correspond to a valid image!'
    );
  }

  clearImagePreview() {
    this.showImagePreview = false;
    this.model.thumbnailPath = '';
  }
}
