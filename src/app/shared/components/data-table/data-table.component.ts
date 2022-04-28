import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export class DataTableColumnOptions {
  name: string;
  emitOnly?: boolean;
  redirectParams?: string[];
}

export type DataTableComponentColumnClickEventArgs<Type> = {
  columnName: string;
  rowData: Type;
};

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent<Type> implements AfterViewInit, OnChanges {
  tableDataSource: MatTableDataSource<Type>;

  @Input() dataSource: Type[];
  @Input() columnOptions: DataTableColumnOptions[];
  @Input() pageSizeOptions: number[];

  @Output() columnClicked: EventEmitter<
    DataTableComponentColumnClickEventArgs<Type>
  > = new EventEmitter();

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
   * Takes the redirection arguments provided and parse them into a valid URL.
   * @param args array that contains the main route (ex: /deck/) in the first position, and any arguments to be extracted directly from the entitiy's properties in the following positions (ex: 'deckId').
   * @param row object representing an individual entity, taken from the DataTable.
   * @returns the correctly parsed URL.
   */
  parseRedirectArgs(args: string[], row: any): string[] {
    return [args[0], ...(args.slice(1).map((x) => row[x]) as string[])];
  }

  handle(columnName: string, row: Type) {
    this.columnClicked.emit({ columnName: columnName, rowData: row });
  }

  /**
   * I need to declare this function here because it is not possible to call a 'map' operation directly on the HTML file.
   * @returns
   */
  getColumnNames(): string[] {
    return this.columnOptions.map((x) => x.name);
  }
}
