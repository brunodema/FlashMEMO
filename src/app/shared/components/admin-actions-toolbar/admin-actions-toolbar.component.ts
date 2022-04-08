import { Component, Input, OnInit } from '@angular/core';
import { RouteMap } from 'src/app/shared/models/routing/route-map';

@Component({
  selector: 'app-admin-actions-toolbar',
  templateUrl: './admin-actions-toolbar.component.html',
  styleUrls: ['./admin-actions-toolbar.component.css'],
})
export class AdminActionsToolbarComponent implements OnInit {
  @Input() routes: RouteMap[];

  constructor() {}

  ngOnInit(): void {}
}
