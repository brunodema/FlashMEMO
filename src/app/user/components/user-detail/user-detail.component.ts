import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UserFormMode } from '../common/user-data-form/user-model-form.component';

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
  /**
   * Enum representing which logic should be applied to the user form component.
   */
  formMode: UserFormMode;

  constructor(private route: ActivatedRoute) {
    this.userModel = this.route.snapshot.data['user'];
    if (this.userModel) {
      this.formMode = UserFormMode.EDIT;
    } else {
      this.formMode = UserFormMode.CREATE;
    }
  }
}
