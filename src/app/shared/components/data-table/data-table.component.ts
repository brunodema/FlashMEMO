import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GeneralRepositoryService } from 'src/app/shared/services/general-repository-service';
import { environment } from 'src/environments/environment';

export type lol = {
  [key: string]: { path: string };
};

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent<Type> implements AfterViewInit {
  dataSource: MatTableDataSource<Type>;

  @Input() displayedColumns: string[];
  @Input() pageSizeOptions: number[];
  @Input() redirectionOptions: lol = {};

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private dataTableService: GeneralRepositoryService<Type>) {
    this.dataTableService
      .search({ pageSize: environment.maxPageSize, pageNumber: 1 })
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
      });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
