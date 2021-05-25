import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-preferences-dropdown',
  templateUrl: './user-preferences-dropdown.component.html',
  styleUrls: ['./user-preferences-dropdown.component.css'],
})
export class UserPreferencesDropdownComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  login() {
    this.authService.login('sysadmin@flashmemo.com', 'Flashmemo@123').subscribe(
      (result) => {
        this.toastr
          .success('You will soon be redirected', 'Welcome to FlashMEMO!', {
            timeOut: 3000,
          })
          .onHidden.subscribe(() => this.redirectToHome());
      },
      (error) => {
        console.log(error);
      }
    );
  }

  redirectToHome() {
    this.router.navigate(['/news']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
