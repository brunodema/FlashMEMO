import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export class DataTableColumnOptions {
  name: string;
  emitValue?: boolean;
  redirectParams?: string[];
}

export type DataTableComponentClickEventArgs<Type> = {
  columnName: string;
  rowData: Type;
};

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent<Type>
  implements AfterViewInit, OnChanges, OnInit
{
  tableDataSource: MatTableDataSource<Type>;

  @Input() dataSource: Type[];
  @Input() columnOptions: DataTableColumnOptions[];
  @Input() pageSizeOptions: number[];
  @Input() editColumnProperty: string;
  @Input() deleteColumnProperty: string;

  @Output() rowClick: EventEmitter<DataTableComponentClickEventArgs<Type>> =
    new EventEmitter();
  @Output() editClick: EventEmitter<DataTableComponentClickEventArgs<Type>> =
    new EventEmitter();
  @Output() deleteClick: EventEmitter<DataTableComponentClickEventArgs<Type>> =
    new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor() {}
  ngOnInit(): void {}

  // so... I have to put the paginator/sort assignment twice here to consider two possible cases: async data loading, which is processed outside the widget (differently from many online examples), and situations where the widget is 'hidden' at first (ex: inside accordion). This ensures that both cases work.
  ngOnChanges(changes: SimpleChanges): void {
    this.tableDataSource = new MatTableDataSource(this.dataSource);
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
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
    this.rowClick.emit({ columnName: columnName, rowData: row });
  }

  raiseEdit(row: Type) {
    this.editClick.emit({
      columnName: this.editColumnProperty,
      rowData: row,
    });
    console.log({
      columnName: this.editColumnProperty,
      rowData: row,
    });
  }

  raiseDelete(row: Type) {
    this.deleteClick.emit({
      columnName: this.deleteColumnProperty,
      rowData: row,
    });
    console.log({
      columnName: this.deleteColumnProperty,
      rowData: row,
    });
  }

  /**
   * I need to declare this function here because it is not possible to call a 'map' operation directly on the HTML file.
   * @returns
   */
  getColumnNames(): string[] {
    let columnNames = this.columnOptions.map((x) => x.name);
    if (this.editColumnProperty) columnNames.push('edit');
    if (this.deleteColumnProperty) columnNames.push('delete');

    return columnNames;
  }
}
