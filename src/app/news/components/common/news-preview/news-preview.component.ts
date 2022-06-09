import { Component, Inject, Input, OnInit } from '@angular/core';
import { News } from 'src/app/news/models/news.model';
import { User } from 'src/app/user/models/user.model';
import { GenericUserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-news-preview',
  templateUrl: './news-preview.component.html',
  styleUrls: ['./news-preview.component.css'],
})
export class NewsPreviewComponent implements OnInit {
  /**
   * Model used to setup the new News object.
   */
  @Input()
  model: News = new News();

  /**
   * Information associated with user who authored the News.
   */
  ownerInfo: User = new User();

  constructor(
    @Inject('GenericUserService') protected userService: GenericUserService
  ) {}

  ngOnInit(): void {
    // wow, so many cases where this is actually useful :D
    if (this.model.ownerId.trim().length > 0) {
      this.userService.get(this.model.ownerId).subscribe((response) => {
        this.ownerInfo = response.data;
      });
    }
  }
}
