import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/user/models/user.model';

@Component({
  selector: 'app-user-preferences-dropdown',
  templateUrl: './user-preferences-dropdown.component.html',
})
export class UserPreferencesDropdownComponent {
  constructor(
    @Inject('GenericAuthService') public authService: GenericAuthService,
    private router: Router
  ) {
    this.user$.subscribe((user) => {
      this.username = user.username;
      this.userId = user.id;
    });
  }

  public username: string;
  public userId: string;

  public user$: Observable<User> = this.authService.loggedUser;

  logout() {
    this.authService.logout();
  }
}
