import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  LoginResponseModel,
} from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-preferences-dropdown',
  templateUrl: './user-preferences-dropdown.component.html',
  styleUrls: ['./user-preferences-dropdown.component.css'],
})
export class UserPreferencesDropdownComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login() {
    this.authService.isAuthenticated();
    this.authService.login('sysadmin@flashmemo.com', 'Flashmemo@123').subscribe(
      (resp) => console.log(resp),
      (err) => console.log(err)
    );
  }
}
