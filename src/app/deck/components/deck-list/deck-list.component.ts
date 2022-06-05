import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import {
  DataTableColumnOptions,
  DataTableComponent,
  DataTableComponentClickEventArgs,
} from 'src/app/shared/components/data-table/data-table.component';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { Deck, ExtendedDeckInfoDTO } from '../../models/deck.model';
import { GenericDeckService } from '../../services/deck.service';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
})
export class DeckListComponent {
  userDeckData$ = new BehaviorSubject<ExtendedDeckInfoDTO[]>([]);
  refreshUserDeckDataSource() {
    this.deckService
      .getExtendedDeckInfo(this.authService.loggedUserId.getValue())
      .subscribe((deckArray) => {
        this.pipeDeckDatesToLocaleShortFormat(deckArray);
        this.userDeckData$.next(deckArray);
      });
  }

  deckData$ = new BehaviorSubject<ExtendedDeckInfoDTO[]>([]);
  refreshDeckDataSource() {
    this.deckService.getExtendedDeckInfo().subscribe((deckArray) => {
      this.pipeDeckDatesToLocaleShortFormat(deckArray);
      this.deckData$.next(deckArray);
    });
  }

  /**
   * Function that converts the UTC DateTimes from the DB to a more readable format. The new dates can be seen on the DataTable components.
   * @param deckArray
   */
  pipeDeckDatesToLocaleShortFormat(deckArray: Deck[]) {
    deckArray.map((deck) => {
      deck.lastUpdated = this.datePipe
        .transform(deck.lastUpdated, 'short')!
        .toString();
      deck.creationDate = this.datePipe
        .transform(deck.creationDate, 'short')!
        .toString();
    });
  }

  columnOptions: DataTableColumnOptions[] = [
    {
      columnId: 'name',
      displayName: 'Name',
      redirectParams: ['/deck/', 'deckId'],
    },
    { columnId: 'description', displayName: 'Description' },
    { columnId: 'flashcardCount', displayName: 'Flashcards' },
    { columnId: 'languageISOCode', displayName: 'Language' },
    { columnId: 'creationDate', displayName: 'Creation Date' },
    { columnId: 'lastUpdated', displayName: 'Last Updated' },
  ];
  pageSizeOptions: number[] = [5, 10, 25];

  routes: RouteMap[] = [{ label: 'Create Deck', route: '/deck/create' }];

  @ViewChild(DataTableComponent)
  dataTable: DataTableComponent<ExtendedDeckInfoDTO>;

  constructor(
    @Inject('GenericDeckService') public deckService: GenericDeckService,
    protected notificationService: GenericNotificationService,
    @Inject('GenericAuthService') protected authService: GenericAuthService,
    private datePipe: DatePipe
  ) {
    this.refreshDeckDataSource();
    this.refreshUserDeckDataSource();
  }

  handleDeleteDeck(args: DataTableComponentClickEventArgs<Deck>) {
    if (
      confirm(`Are you sure you want to delete deck '${args.rowData.name}'?`)
    ) {
      this.deckService.delete(args.rowData.deckId).subscribe((x) => {
        this.notificationService.showSuccess('Deck deleted.');
        this.refreshDeckDataSource();
        this.refreshUserDeckDataSource();
      });
    }
  }
}
