import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './components/default/default.component';
import { SharedModule } from '../shared/shared.module';
import { TestRoutingModule } from './routing/test-routing.module';
import { NewsModule } from '../news/news.module';

@NgModule({
  declarations: [DefaultComponent],
  imports: [CommonModule, TestRoutingModule, SharedModule, NewsModule],
})
export class TestModule {}
