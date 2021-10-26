import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { News } from '../news/models/news.model';
import { NewsService } from '../news/services/news.service';
import { RouteMap } from '../shared/models/route-map/route-map';

import { DataTableComponent } from '../shared/components/data-table/data-table/data-table.component';
import { DataTableService } from '../shared/models/DataTableService';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [{ provide: DataTableService, useClass: NewsService }],
})
export class UserComponent implements AfterViewInit {
  displayedColumns: string[] = ['newsID', 'title', 'content'];
  pageSizeOptions: number[] = [5, 10, 25];

  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<News>;

  constructor(public service: DataTableService<News>) {}

  ngAfterViewInit(): void {
    this.dataTable.displayedColumns = this.displayedColumns;
    this.dataTable.pageSizeOptions = this.pageSizeOptions;
  }
}
