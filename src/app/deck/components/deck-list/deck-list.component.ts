import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  DataTableComponent,
  lol,
} from 'src/app/shared/components/data-table/data-table.component';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { GeneralRepositoryService } from 'src/app/shared/services/general-repository-service';
import { Deck } from '../../models/deck.model';
import { DeckService, MockDeckService } from '../../services/deck.service';
import { DeckDetailComponent } from '../deck-detail/deck-detail.component';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  providers: [{ provide: GeneralRepositoryService, useClass: MockDeckService }],
})
export class DeckListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'ownerId',
    'languageISOCode',
    'creationDate',
    'lastUpdated',
  ];
  pageSizeOptions: number[] = [5, 10, 25];
  redirectionOptions: lol = {
    name: { path: '/deck/:id' },
  };
  routes: RouteMap[] = [{ label: 'Create Deck', route: 'create' }];

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<Deck>;

  constructor(public service: GeneralRepositoryService<Deck>) {}

  ngAfterViewInit(): void {
    this.dataTable.displayedColumns = this.displayedColumns;
    this.dataTable.pageSizeOptions = this.pageSizeOptions;
  }
}
