import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-preferences-dropdown',
  templateUrl: './user-preferences-dropdown.component.html',
})
export class UserPreferencesDropdownComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  @Input() username: string = '?';

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
