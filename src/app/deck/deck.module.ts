import { CommonModule } from '@angular/common';
import { DeckListComponent } from './components/deck-list/deck-list.component';
import { DeckDetailComponent } from './components/deck-detail/deck-detail.component';
import { DeckRoutingModule } from './routing/deck-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeckCreateComponent } from './components/deck-create/deck-create.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyModule } from '@ngx-formly/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';

@NgModule({
  declarations: [DeckListComponent, DeckDetailComponent, DeckCreateComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    FormlyModule.forChild(),
    FormlyMaterialModule,
    DeckRoutingModule,
    SharedModule,
  ],
})
export class DeckModule {}
