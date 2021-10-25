import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { News } from '../news/models/news.model';
import { NewsService } from '../news/services/news.service';
import { RouteMap } from '../shared/models/route-map/route-map';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  displayedColumns: string[] = ['newsID', 'title', 'content'];
  dataSource: MatTableDataSource<News> = new MatTableDataSource();

  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public service: NewsService) {
    this.service.search({ pageSize: 37, pageNumber: 1 }).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
