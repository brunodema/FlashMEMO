import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe-pipe.pipe';
import { AdminActionsToolbarComponent } from './components/admin-actions-toolbar/admin-actions-toolbar.component';
import { DataTableComponent } from './components/data-table/data-table/data-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { UserPreferencesDropdownComponent } from './components/user-preferences-dropdown/user-preferences-dropdown.component';

// Material UI stuff for dynamic tables
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input'; // this one is not mentioned in any tutorial, BUT IS REQUIRED FOR THE SORTABLE/FILTERABLE/PAGINATED TABLE TO WORK!
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FlashcardContentWizardComponent } from './components/flashcard/flashcard-content-wizard/flashcard-content-wizard.component';
import { FlashcardLayoutComponent } from './components/flashcard/flashcard-layout/flashcard-layout.component';

@NgModule({
  declarations: [
    SafePipe,
    HeaderComponent,
    DataTableComponent,
    FooterComponent,
    AdminActionsToolbarComponent,
    DataTableComponent,
    UserPreferencesDropdownComponent,
    FlashcardContentWizardComponent,
    FlashcardLayoutComponent,
    FlashcardLayoutComponent,
  ],
  imports: [
    CollapseModule,
    CommonModule,
    RouterModule,
    // Material
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
  ],
  exports: [
    SafePipe,
    HeaderComponent,
    DataTableComponent,
    FooterComponent,
    AdminActionsToolbarComponent,
    DataTableComponent,
    UserPreferencesDropdownComponent,
    FlashcardContentWizardComponent,
    FlashcardLayoutComponent,
  ],
  providers: [SafePipe],
})
export class SharedModule {}
