import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericRepositoryService } from 'src/app/shared/services/general-repository.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent<Type> {
  /**
   * Model data associated with the 'detail' view.
   */
  model: Type

  constructor(protected route: ActivatedRoute, protected service : GenericRepositoryService<Type>) {
    this.model = this.route.snapshot.data[this.service.getTypename()];
  }

}
