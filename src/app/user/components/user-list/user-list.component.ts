import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { News } from 'src/app/news/models/news.model';
import { NewsService } from 'src/app/news/services/news.service';
import { GeneralRepositoryService } from 'src/app/shared/services/data-table-service';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

@Component({
  selector: 'app-user',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [{ provide: GeneralRepositoryService, useClass: NewsService }],
})
export class UserListComponent implements AfterViewInit {
  displayedColumns: string[] = ['newsID', 'title', 'content'];
  pageSizeOptions: number[] = [5, 10, 25];

  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<News>;

  constructor(public service: GeneralRepositoryService<News>) {}

  ngAfterViewInit(): void {
    this.dataTable.displayedColumns = this.displayedColumns;
    this.dataTable.pageSizeOptions = this.pageSizeOptions;
  }
}
