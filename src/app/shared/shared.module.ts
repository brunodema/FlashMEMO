import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe-pipe.pipe';
import { RouterModule } from '@angular/router';
import { AdminActionsToolbarComponent } from './components/admin-actions-toolbar/admin-actions-toolbar.component';
import { DataTableComponent } from './components/data-table/data-table/data-table.component';

// Material UI stuff for dynamic tables
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input'; // this one is not mentioned in any tutorial, BUT IS REQUIRED FOR THE SORTABLE/FILTERABLE/PAGINATED TABLE TO WORK!
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [SafePipe, AdminActionsToolbarComponent, DataTableComponent],
  imports: [
    CommonModule,
    RouterModule,
    // Material
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
  ],
  exports: [SafePipe, AdminActionsToolbarComponent, DataTableComponent],
  providers: [SafePipe],
})
export class SharedModule {}
