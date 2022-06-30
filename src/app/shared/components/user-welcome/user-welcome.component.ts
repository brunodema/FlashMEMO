import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Deck, ExtendedDeckInfoDTO } from 'src/app/deck/models/deck.model';
import { GenericDeckService } from 'src/app/deck/services/deck.service';
import { GenericAuthService } from '../../services/auth.service';
import {
  GenericSpinnerService,
  SpinnerType,
} from '../../services/UI/spinner.service';
import {
  DataTableColumnOptions,
  DataTableComponent,
} from '../data-table/data-table.component';

@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.css'],
})
export class UserWelcomeComponent {
  constructor(
    @Inject('GenericAuthService') public authService: GenericAuthService,
    @Inject('GenericSpinnerService')
    protected spinnerService: GenericSpinnerService,
    @Inject('GenericDeckService') protected deckService: GenericDeckService
  ) {
    this.refreshDeckDataSource();
  }

  private maxListSize = 5;

  columnOptions: DataTableColumnOptions[] = [
    {
      columnId: 'name',
      displayName: 'Name',
      redirectParams: ['/deck/', 'deckId'],
    },
    { columnId: 'dueFlashcardCount', displayName: 'Due Flashcards' },
  ];
  pageSizeOptions: number[] = [5];

  @ViewChild('deckTable')
  public userTable: DataTableComponent<ExtendedDeckInfoDTO>;

  deckData$ = new BehaviorSubject<ExtendedDeckInfoDTO[]>([]);
  refreshDeckDataSource() {
    this.spinnerService.showSpinner(SpinnerType.LOADING);

    this.deckService
      .getExtendedDeckInfo(this.authService.loggedUser.getValue()?.id)
      .subscribe({
        next: (deckArray) => {
          console.log(deckArray);
          this.deckData$.next(deckArray.slice(0, this.maxListSize));
          this.userTable?.toggleAllOff();
        },
        complete: () => this.spinnerService.hideSpinner(SpinnerType.LOADING),
      });
  }
}
