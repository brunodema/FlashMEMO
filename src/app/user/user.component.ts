import { Component, OnInit } from '@angular/core';
import { News } from '../news/models/news.model';
import { NewsService } from '../news/services/news.service';
import { RouteMap } from '../shared/models/route-map/route-map';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  searchTerm: string;
  pageNumber: number;
  pageSize: number;
  news: News[];
  total: number;

  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  constructor(public service: NewsService) {
    service.getAllNews().subscribe((res) => {
      this.news = res;
      this.total = this.news.length;
    });
  }

  ngOnInit(): void {}

  // @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  // onSort({ column, direction }: SortEvent) {
  //   // resetting other headers
  //   this.headers.forEach((header) => {
  //     if (header.sortable !== column) {
  //       header.direction = '';
  //     }
  //   });

  //   this.service.sortColumn = column;
  //   this.service.sortDirection = direction;
}

/*
* Set to what the search bar will attach to (which properties)
  * Set search function
* Set service to attach to
* Set an array of columns. For each:
  * Label of column
  * Property to bind
  * Sort function
* Set default page size



*/
