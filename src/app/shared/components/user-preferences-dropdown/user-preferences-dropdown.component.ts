import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { IAuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-preferences-dropdown',
  templateUrl: './user-preferences-dropdown.component.html',
})
export class UserPreferencesDropdownComponent {
  constructor(
    public authService: IAuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  @Input() username$: Observable<string> = this.authService.loggedUsername;

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
