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
  deckData$ = new BehaviorSubject<ExtendedDeckInfoDTO[]>([]);
  userDeckData$ = new BehaviorSubject<ExtendedDeckInfoDTO[]>([]);

  refreshDeckDataSource() {
    this.deckService.getExtendedDeckInfo().subscribe((deckArray) => {
      this.pipeDeckDatesToLocaleShortFormat(deckArray);
      this.deckData$.next(deckArray);
      this.userDeckData$.next(
        deckArray.filter(
          (d) => d.ownerId === this.authService.loggedUser.getValue().id
        )
      );
      this.adminDeckTable.toggleAllOff();
      this.userDeckTable.toggleAllOff();
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

  @ViewChild('userDeckTable')
  public userDeckTable: DataTableComponent<ExtendedDeckInfoDTO>;
  @ViewChild('adminDeckTable')
  public adminDeckTable: DataTableComponent<ExtendedDeckInfoDTO>;

  constructor(
    @Inject('GenericDeckService') public deckService: GenericDeckService,
    protected notificationService: GenericNotificationService,
    @Inject('GenericAuthService') public authService: GenericAuthService,
    private datePipe: DatePipe
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

  showEditIconn = (item: Deck) => {
    return (
      this.authService.isLoggedUserAdmin ||
      item.deckId === this.authService.loggedUser.getValue().id
    );
  };

  showDeleteIcon = (item: Deck) => {
    return (
      this.authService.isLoggedUserAdmin ||
      item.deckId === this.authService.loggedUser.getValue().id
    );
  };

  async massDeleteDecks(decks: Deck[]) {
    console.log(decks);
    if (
      confirm(
        decks.length > 1
          ? `Are you sure you want to delete these ${decks.length} Decks?`
          : 'Are you sure you want to delete this Deck?'
      )
    ) {
      await new Promise<void>((resolve) => {
        decks.forEach((deck, index) => {
          console.log(deck);
          this.deckService.delete(deck.deckId).subscribe({
            error: () =>
              this.notificationService.showError(
                'An error ocurred while deleting the Deck'
              ),
            complete: () => {
              if (index === decks.length - 1) {
                resolve();
              }
            },
          });
        });
      });

      this.notificationService.showSuccess('Deck(s) successfully deleted.');
      this.refreshDeckDataSource();
    }
  }
}
