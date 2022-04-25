import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckListComponent } from './components/deck-list/deck-list.component';
import { DeckDetailComponent } from './components/deck-detail/deck-detail.component';
import { DeckRoutingModule } from './routing/deck-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DeckCreateComponent } from './components/deck-create/deck-create.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

@NgModule({
  declarations: [DeckListComponent, DeckDetailComponent, DeckCreateComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    FormlyModule.forChild(),
    DeckRoutingModule,
    SharedModule,
  ],
})
export class DeckModule {}
