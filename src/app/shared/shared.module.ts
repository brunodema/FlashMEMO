import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe-pipe.pipe';
import { AdminActionsToolbarComponent } from './components/admin-actions-toolbar/admin-actions-toolbar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { UserPreferencesDropdownComponent } from './components/user-preferences-dropdown/user-preferences-dropdown.component';
import { MatTableModule } from '@angular/material/table'; // Material UI stuff for dynamic tables
import { MatFormFieldModule } from '@angular/material/form-field'; // Material UI stuff for dynamic tables
import { MatSortModule } from '@angular/material/sort'; // Material UI stuff for dynamic tables
import { MatInputModule } from '@angular/material/input'; // this one is not mentioned in any tutorial, BUT IS REQUIRED FOR THE SORTABLE/FILTERABLE/PAGINATED TABLE TO WORK!
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FlashcardContentOptionsBlock } from './components/flashcard/flashcard-content-options-block/flashcard-content-options-block.component';
import { FlashcardLayoutComponent } from './components/flashcard/flashcard-layout/flashcard-layout.component';
import { FlashcardContentEditorComponent } from './components/flashcard/flashcard-content-editor/flashcard-content-editor.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner'; // NGX-Spinner
import { ImageLoaderDirective } from './directives/image-loader.directive';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    SafePipe,
    HeaderComponent,
    FooterComponent,
    AdminActionsToolbarComponent,
    DataTableComponent,
    UserPreferencesDropdownComponent,
    FlashcardContentOptionsBlock,
    FlashcardLayoutComponent,
    FlashcardLayoutComponent,
    FlashcardContentEditorComponent,
    ImageLoaderDirective,
  ],
  imports: [
    CollapseModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule, // Material
    MatPaginatorModule, // Material
    MatTableModule, // Material
    MatSortModule, // Material
    MatInputModule, // Material
    NgxSpinnerModule, // NGX-Spinner
    QuillModule, // NGX-Quill
  ],
  exports: [
    SafePipe,
    HeaderComponent,
    FooterComponent,
    AdminActionsToolbarComponent,
    DataTableComponent,
    UserPreferencesDropdownComponent,
    FlashcardContentOptionsBlock,
    FlashcardLayoutComponent,
    ImageLoaderDirective,
  ],
  providers: [SafePipe],
})
export class SharedModule {}
