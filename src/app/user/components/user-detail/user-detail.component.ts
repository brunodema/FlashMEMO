import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  GenericUserStatsService,
  UserStats,
} from 'src/app/shared/services/user-stats.service';
import { User } from '../../models/user.model';
import { UserFormMode } from '../common/user-data-form/user-model-form.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent {
  constructor(
    private route: ActivatedRoute,
    @Inject('GenericUserStatsService')
    protected userStatsService: GenericUserStatsService
  ) {
    this.userModel = this.route.snapshot.data['user'];
    if (this.userModel) {
      this.formMode = UserFormMode.EDIT;
      this.userStats$ = this.userStatsService.getUserStats(this.userModel.id);
    } else {
      this.formMode = UserFormMode.CREATE;
    }
  }
  /**
   * User data associated with the 'detail' view.
   */
  userModel: User = new User();
  /**
   * Stats related to the user, similar to what is implemented in the 'user-welcome' component.
   */
  userStats$: Observable<UserStats>;
  /**
   * Enum representing which logic should be applied to the user form component.
   */
  formMode: UserFormMode;
}
