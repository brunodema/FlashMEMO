import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe-pipe.pipe';
import { RouterModule } from '@angular/router';
import { AdminActionsToolbarComponent } from './components/admin-actions-toolbar/admin-actions-toolbar.component';
import { NgbHighlight, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SafePipe, AdminActionsToolbarComponent],
  imports: [CommonModule, RouterModule],
  exports: [SafePipe, AdminActionsToolbarComponent],
  providers: [SafePipe],
})
export class SharedModule {}
