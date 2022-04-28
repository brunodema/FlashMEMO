import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  DataTableColumnOptions,
  DataTableComponent,
  DataTableComponentClickEventArgs,
} from 'src/app/shared/components/data-table/data-table.component';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { Deck } from '../../models/deck.model';
import { GenericDeckService } from '../../services/deck.service';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
})
export class DeckListComponent {
  deckData: Deck[];
  columnOptions: DataTableColumnOptions[] = [
    { name: 'name', redirectParams: ['/deck/', 'deckId'] },
    { name: 'description' },
    { name: 'ownerId', emitValue: true },
    { name: 'languageISOCode' },
    { name: 'creationDate' },
    { name: 'lastUpdated' },
  ];
  pageSizeOptions: number[] = [5, 10, 25];

  routes: RouteMap[] = [{ label: 'Create Deck', route: 'create' }];

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<Deck>;

  constructor(public service: GenericDeckService) {
    this.service.getAll().subscribe((x) => (this.deckData = x));
  }

  handleDeleteDeck(args: DataTableComponentClickEventArgs<Deck>) {
    if (confirm(`Are you sure you want to delete deck '${args.rowData.name}'?`))
      console.log('deck deleted! (but actually not)');
  }
}
