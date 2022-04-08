import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ILoginResponse } from '../../models/http/response-interfaces';

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

  ngOnInit(): void {}

  login(email: string, password: string) {
    this.authService.login({ email, password }).subscribe(
      (result) => {
        this.toastr
          .success('You will soon be redirected.', 'Welcome to FlashMEMO!', {
            timeOut: 3000,
          })
          .onHidden.subscribe(() => this.redirectToHome());
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          this.processErrorsFromAPI(error.error),
          'Authentication Failure',
          {
            timeOut: 3000,
          }
        );
      }
    );
  }

  redirectToHome() {
    this.router.navigate(['/news']);
  }

  processErrorsFromAPI(errorResponse: ILoginResponse): string {
    let resp = errorResponse.message + '\n\n';
    if (errorResponse.errors) {
      errorResponse.errors.forEach((error) => {
        resp += `\n${error}`;
      });
    }
    return resp;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
