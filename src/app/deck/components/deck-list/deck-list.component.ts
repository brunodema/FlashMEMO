import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import {
  DataTableColumnOptions,
  DataTableComponent,
  DataTableComponentClickEventArgs,
} from 'src/app/shared/components/data-table/data-table.component';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { Deck } from '../../models/deck.model';
import { GenericDeckService } from '../../services/deck.service';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
})
export class DeckListComponent {
  deckData$ = new BehaviorSubject<Deck[]>([]);

  refreshDeckDataSource() {
    this.deckService
      .getAll()
      .subscribe((deckArray) => this.deckData$.next(deckArray));
  }

  columnOptions: DataTableColumnOptions[] = [
    {
      columnId: 'name',
      displayName: 'Name',
      redirectParams: ['/deck/', 'deckId'],
    },
    { columnId: 'description', displayName: 'Description' },
    { columnId: 'ownerId', displayName: '', emitValue: true },
    { columnId: 'languageISOCode', displayName: 'Language' },
    { columnId: 'creationDate', displayName: 'Creation Date' },
    { columnId: 'lastUpdated', displayName: 'Last Updated' },
  ];
  pageSizeOptions: number[] = [5, 10, 25];

  routes: RouteMap[] = [{ label: 'Create Deck', route: '/deck/create' }];

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<Deck>;

  constructor(
    public deckService: GenericDeckService,
    protected notificationService: GenericNotificationService
  ) {
    this.refreshDeckDataSource();
  }

  handleDeleteDeck(args: DataTableComponentClickEventArgs<Deck>) {
    if (
      confirm(`Are you sure you want to delete deck '${args.rowData.name}'?`)
    ) {
      this.deckService.delete(args.rowData.deckId).subscribe((x) => {
        this.notificationService.showSuccess('Deck deleted.');
        this.refreshDeckDataSource();
      });
    }
  }
}
