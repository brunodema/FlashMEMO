import { Component, Inject, Input, OnInit } from '@angular/core';
import { News } from 'src/app/news/models/news.model';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
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
  ownerInfo: User | null = new User();

  constructor(
    @Inject('GenericUserService') protected userService: GenericUserService,
    @Inject('GenericAuthService') protected authService: GenericAuthService
  ) {}

  ngOnInit(): void {
    // wow, so many cases where this is actually useful :D
    if (this.model.ownerId.trim().length > 0) {
      this.userService.get(this.model.ownerId).subscribe((response) => {
        this.ownerInfo = response.data;
      });
    } else {
      this.ownerInfo = this.authService.loggedUser.getValue();
    }
  }
}
