import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export type DataTableRedirectionOptions = {
  [key: string]: { path: string; params?: string[] };
};

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent<Type> implements AfterViewInit, OnChanges {
  tableDataSource: MatTableDataSource<Type>;

  @Input() dataSource: Type[];
  @Input() displayedColumns: string[];
  @Input() pageSizeOptions: number[];
  @Input() redirectionOptions: DataTableRedirectionOptions = {};

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.tableDataSource = new MatTableDataSource(this.dataSource);
  }
  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  /**
   * Function used to allow certain columns to embed redirection tools to other views upon clicking.
   * @param args The route prefix for redirection (ex: '/deck'), plus any derived paths within the main route, which are referenced by the entity's properties (ex: 'deckId', so it redirects to the detail view of a Deck).
   * @param row The row object from the HTML.
   * @returns Parsed input to be used by the routerLink.
   */
  parseRedirectArgs(
    args: { path: string; params?: string[] },
    row: any
  ): string[] {
    return [args.path, ...(args.params?.map((x) => row[x]) as string[])]; // so, what the heck is going on here... first, I set the main route as the prefix for redirection. Then, I check every content of the 'params' array, and use them to select the corresponding data from the properties of the templated entity (ex: get the Deck GUID via row['deckId']). Finally, the resulting any[] object is cast into string[], so TS stops annoying me.
  }
}
