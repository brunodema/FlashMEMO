import { Component, Inject, ViewChild } from '@angular/core';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import {
  DataTableColumnOptions,
  DataTableComponent,
  DataTableComponentClickEventArgs,
} from 'src/app/shared/components/data-table/data-table.component';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';
import { GenericUserService } from '../../services/user.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router } from '@angular/router';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import {
  GenericSpinnerService,
  SpinnerType,
} from 'src/app/shared/services/UI/spinner.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
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

  @ViewChild('userTable')
  public userTable: DataTableComponent<User>;

  userData$ = new BehaviorSubject<User[]>([]);
  refreshUserDataSource() {
    this.spinnerService.showSpinner(SpinnerType.LOADING);

    this.userService.getAll().subscribe({
      next: (userArray) => {
        this.userData$.next(userArray);
        this.userTable?.toggleAllOff();
      },
      complete: () => this.spinnerService.hideSpinner(SpinnerType.LOADING),
    });
  }

  constructor(
    @Inject('GenericUserService') private userService: GenericUserService,
    @Inject('GenericAuthService') public authService: GenericAuthService,
    private notificationService: GenericNotificationService,
    private router: Router,
    @Inject('GenericSpinnerService')
    protected spinnerService: GenericSpinnerService
  ) {
    this.refreshUserDataSource();
  }

  showEditIcon = (item: User) => {
    return (
      this.authService.isLoggedUserAdmin() ||
      item.id === this.authService.loggedUser.getValue()?.id
    );
  };

  showDeleteIcon = (item: User) => {
    return (
      this.authService.isLoggedUserAdmin() ||
      item.id === this.authService.loggedUser.getValue()?.id
    );
  };

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

  async massDeleteUsers() {
    let ids = this.userTable.selection.selected.map((u) => u.id);

    if (
      confirm(
        ids.length > 1
          ? `Are you sure you want to delete these ${ids.length} Users?`
          : 'Are you sure you want to delete this User?'
      )
    ) {
      await new Promise<void>((resolve) => {
        ids.forEach((id, index) => {
          this.userService.delete(id).subscribe({
            error: () =>
              this.notificationService.showError(
                'An error ocurred while deleting the User'
              ),
            complete: () => {
              if (index === ids.length - 1) resolve();
            },
          });
        });
      });

      this.notificationService.showSuccess('User(s) successfully deleted.');
      this.refreshUserDataSource();
    }
  }
}
