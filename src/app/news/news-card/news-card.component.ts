import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/user/models/user.model';
import { ExtendedNews, News } from '../models/news.model';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css'],
})
export class NewsCardComponent {
  /**
   * Reference News model to be rendered by the component.
   */
  @Input() extendedNews: ExtendedNews = new ExtendedNews();

  /**
   * Relays a 'delete' event in case the button is clicked.
   */
  @Output() delete: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject('GenericAuthService') public authService: GenericAuthService
  ) {}

  deleteClick() {
    this.delete.emit(this.extendedNews.newsId);
  }
}
