import { Component, OnInit } from '@angular/core';
import { RouteMap } from '../shared/models/route-map/route-map';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  routes : RouteMap[] = [
    {label: "Create User", route: "create"}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
