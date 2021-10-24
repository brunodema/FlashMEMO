import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { News } from '../news/models/news.model';
import { NewsService } from '../news/services/news.service';
import { RouteMap } from '../shared/models/route-map/route-map';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements AfterViewInit, AfterContentChecked {
  displayedColumns: string[] = ['newsId', 'title', 'content'];
  dataSource: MatTableDataSource<News>;

  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public service: NewsService) {
    const testList: News[] = [
      {
        newsID: 'eh3u23r3',
        title: 'ddaasdds',
        subtitle: 'dsadsasda',
        content: 'sadsadsadsasdsdsdsda',
        thumbnailPath: 'ddsasa',
        creationDate: Date.now(),
        lastUpdated: Date.now(),
      },
      {
        newsID: 'dsd2e13r3r',
        title: 'ddaf44fasdds',
        subtitle: 'dsadsf4f4asda',
        content: 'sadsads3r2f33fadsasdsdsdsda',
        thumbnailPath: 'ddsasa',
        creationDate: Date.now(),
        lastUpdated: Date.now(),
      },
      {
        newsID: '1232dwqwa',
        title: 'sdasd',
        subtitle: 'sdda3wd',
        content: 'sadsad3rf3w3fsadsasdsdsdsda',
        thumbnailPath: 'ddsasa',
        creationDate: Date.now(),
        lastUpdated: Date.now(),
      },
    ];

    this.dataSource = new MatTableDataSource(testList);
    //this.total = this.dataSource.data.length;

    // service.getAllNews().subscribe((res) => {
    //   this.dataSource = new MatTableDataSource(res);
    //   this.total = this.dataSource.data.length;
    // });
  }
  ngAfterContentChecked(): void {
    console.log('olar checked');
  }

  ngAfterViewInit() {
    console.log('olar');
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
