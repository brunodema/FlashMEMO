import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { SafePipeService } from './services/safe-pipe.service';

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
