import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  DataTableComponent,
  DataTableRedirectionOptions,
} from 'src/app/shared/components/data-table/data-table.component';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { Deck } from '../../models/deck.model';
import { GenericDeckService } from '../../services/deck.service';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
})
export class DeckListComponent implements AfterViewInit {
  deckData: Deck[];
  displayedColumns: string[] = [
    'name',
    'description',
    'ownerId',
    'languageISOCode',
    'creationDate',
    'lastUpdated',
  ];
  pageSizeOptions: number[] = [5, 10, 25];
  redirectionOptions: DataTableRedirectionOptions = {
    name: { path: '/deck', params: ['deckId'] },
  };
  routes: RouteMap[] = [{ label: 'Create Deck', route: 'create' }];

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<Deck>;

  constructor(public service: GenericDeckService) {
    this.service.getAll().subscribe((x) => (this.deckData = x));
  }

  ngAfterViewInit(): void {
    this.dataTable.displayedColumns = this.displayedColumns;
    this.dataTable.pageSizeOptions = this.pageSizeOptions;
  }
}
