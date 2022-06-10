import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css'],
})
export class DataListComponent {
  public lol: Array<number> = [1, 2, 3, 4, 5];

  constructor() {
    console.log(this.lol.length);
  }
}
