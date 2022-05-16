import { SelectionModel } from '@angular/cdk/collections';
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
  columnId: string;
  displayName?: string;
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
  @Input() hasEditColumn: boolean;
  @Input() hasDeleteColumn: boolean;
  @Input() hasSelectColumn: boolean;

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

  // Taken from the official Material Table Checkbox example:
  // ********************************************************
  public selection = new SelectionModel<Type>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Type): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      this.columnOptions[1]
    }`;
  }
  // ********************************************************

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

  handleClick(columnName: string, row: Type) {
    this.rowClick.emit({ columnName: columnName, rowData: row });
  }

  raiseEdit(row: Type) {
    this.editClick.emit({
      columnName: 'edit',
      rowData: row,
    });
  }

  raiseDelete(row: Type) {
    this.deleteClick.emit({
      columnName: 'delete',
      rowData: row,
    });
  }

  /**
   * I need to declare this function here because it is not possible to call a 'map' operation directly on the HTML file.
   * @returns
   */
  getColumnNames(): string[] {
    let columnNames = this.columnOptions.map((x) => x.columnId);
    if (this.hasEditColumn) columnNames.push('edit');
    if (this.hasDeleteColumn) columnNames.push('delete');
    if (this.hasSelectColumn) columnNames.unshift('select');

    return columnNames;
  }
}
