import { Component, Inject, ViewChild } from '@angular/core';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import {
  DataTableColumnOptions,
  DataTableComponent,
  DataTableComponentClickEventArgs,
} from 'src/app/shared/components/data-table/data-table.component';
import { Deck } from 'src/app/deck/models/deck.model';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';
import { GenericUserService } from '../../services/user.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})

// this component is a complete shitshow at the moment... pretty much a sandbox for weird shit I want to implement
export class UserListComponent {
  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  columnOptions: DataTableColumnOptions[] = [
    {
      columnId: 'id',
      displayName: 'Id',
      // redirectParams: ['/user/', 'id'], ---> once user detail is created...
    },
    { columnId: 'username', displayName: 'Username' },
    { columnId: 'email', displayName: 'Email' },
  ];
  pageSizeOptions: number[] = [5, 10, 25];

  userData$ = new BehaviorSubject<User[]>([]);
  refreshUserDataSource() {
    this.userService
      .getAll()
      .subscribe((userArray) => this.userData$.next(userArray));
  }

  constructor(
    @Inject('GenericUserService') private userService: GenericUserService,
    private notificationService: GenericNotificationService,
    private router: Router
  ) {
    this.refreshUserDataSource();
  }

  handleEditUser(args: DataTableComponentClickEventArgs<User>) {
    this.router.navigate(['/user', args.rowData.id]);
  }

  handleDeleteUser(args: DataTableComponentClickEventArgs<User>) {
    if (
      confirm(`Are you sure you want to delete user '${args.rowData.email}'?`)
    ) {
      this.userService.delete(args.rowData.id).subscribe((user) => {
        this.notificationService.showSuccess('User deleted.');
        this.refreshUserDataSource();
      });
    }
  }
}
