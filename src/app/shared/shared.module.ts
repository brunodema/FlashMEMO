import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe-pipe.pipe';
import { AdminActionsToolbarComponent } from './components/admin-actions-toolbar/admin-actions-toolbar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserPreferencesDropdownComponent } from './components/user-preferences-dropdown/user-preferences-dropdown.component';
import { MatTableModule } from '@angular/material/table'; // Material UI stuff for dynamic tables
import { MatFormFieldModule } from '@angular/material/form-field'; // Material UI stuff for dynamic tables
import { MatSortModule } from '@angular/material/sort'; // Material UI stuff for dynamic tables
import { MatInputModule } from '@angular/material/input'; // this one is not mentioned in any tutorial, BUT IS REQUIRED FOR THE SORTABLE/FILTERABLE/PAGINATED TABLE TO WORK!
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FlashcardContentOptionsBlockComponent } from './components/flashcard/flashcard-content-options-block/flashcard-content-options-block.component';
import { FlashcardLayoutComponent } from './components/flashcard/flashcard-layout/flashcard-layout.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { NgxSpinnerModule } from 'ngx-spinner'; // NGX-Spinner
import { ImageLoaderDirective } from './directives/image-loader.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ckeditor4-angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FlashcardComponent } from './components/flashcard/flashcard-main/flashcard.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    SafePipe,
    HeaderComponent,
    FooterComponent,
    AdminActionsToolbarComponent,
    DataTableComponent,
    UserPreferencesDropdownComponent,
    FlashcardContentOptionsBlockComponent,
    FlashcardLayoutComponent,
    FlashcardLayoutComponent,
    ImageLoaderDirective,
    FlashcardComponent,
  ],
  imports: [
    CollapseModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatCheckboxModule, // Material Table (Checkbox)
    MatFormFieldModule, // Material
    MatPaginatorModule, // Material
    MatTableModule, // Material
    MatSortModule, // Material
    MatInputModule, // Material
    NgxSpinnerModule, // NGX-Spinner
    CKEditorModule,
    NgbModule,
  ],
  exports: [
    SafePipe,
    HeaderComponent,
    FooterComponent,
    AdminActionsToolbarComponent,
    DataTableComponent,
    UserPreferencesDropdownComponent,
    FlashcardContentOptionsBlockComponent,
    FlashcardComponent,
    FlashcardLayoutComponent,
    ImageLoaderDirective,
  ],
  providers: [SafePipe],
})
export class SharedModule {}
