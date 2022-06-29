import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe-pipe.pipe';
import { AdminActionsToolbarComponent } from './components/admin-actions-toolbar/admin-actions-toolbar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { HeaderComponent } from './components/common/header/header.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { UserPreferencesDropdownComponent } from './components/common/user-preferences-dropdown/user-preferences-dropdown.component';
import { StudySessionComponent } from './components/study-session/study-session/study-session.component';
import { FlashcardAnswerButtonsComponent } from './components/flashcard/flashcard-answer-buttons/flashcard-answer-buttons.component';
import { DetailViewComponent } from './components/common/detail-view/detail-view.component';
import { UserWelcomeComponent } from './components/user-welcome/user-welcome.component';

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
    StudySessionComponent,
    FlashcardAnswerButtonsComponent,
    DetailViewComponent,
    UserWelcomeComponent,
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
    StudySessionComponent,
    FlashcardAnswerButtonsComponent,
    ImageLoaderDirective,
    UserWelcomeComponent,
  ],
  providers: [SafePipe],
})
export class SharedModule {}
