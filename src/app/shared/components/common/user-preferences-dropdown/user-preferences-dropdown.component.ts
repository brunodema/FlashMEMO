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
    this.user$.subscribe();
  }

  public user$: Observable<User | null> = this.authService.loggedUser;

  logout() {
    this.authService.logout();
  }
}
