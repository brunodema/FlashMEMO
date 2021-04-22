import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipeService } from './pipes/safe-pipe.pipe';

@NgModule({
  declarations: [
    SafePipeService
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafePipeService
  ]
})
export class SharedModule {}
