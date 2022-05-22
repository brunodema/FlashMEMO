import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent {
  /**
   * User data associated with the 'detail' view.
   */
  userModel: User = new User();

  constructor(private route: ActivatedRoute) {
    this.userModel = this.route.snapshot.data['user'];
    // console.log(this.userModel, this.route.snapshot.data['user'])
  }
}
