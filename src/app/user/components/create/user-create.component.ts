import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserFormMode } from '../common/user-data-form/user-model-form.component';

@Component({
  selector: 'app-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit {
  formMode: UserFormMode = UserFormMode.CREATE;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      console.log(params); // { order: "popular" }
      if (params.mode === 'register') this.formMode = UserFormMode.REGISTER;
    });
  }

  ngOnInit(): void {}
}
