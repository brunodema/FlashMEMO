import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-preferences-dropdown',
  templateUrl: './user-preferences-dropdown.component.html',
  styleUrls: ['./user-preferences-dropdown.component.css'],
})
export class UserPreferencesDropdownComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.authService.login('sysadmin@flashmemo.com', 'Flashmemo@123').subscribe(
      (result) => {
        this.router.navigate(['/news']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
