import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipeService } from './pipes/safe-pipe.pipe';
import { AdminActionsToolbarComponent } from './components/admin-actions-toolbar/admin-actions-toolbar/admin-actions-toolbar.component';
import { RouteMap } from './models/route-map/route-map';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SafePipeService,
    AdminActionsToolbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    SafePipeService,
    AdminActionsToolbarComponent
  ]
})
export class SharedModule {}
