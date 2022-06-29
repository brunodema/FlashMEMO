import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Deck } from 'src/app/deck/models/deck.model';
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
  ) {}

  columnOptions: DataTableColumnOptions[] = [
    {
      columnId: 'deckId',
      displayName: 'Id',
    },
    { columnId: 'name', displayName: 'Name' },
  ];
  pageSizeOptions: number[] = [5];

  @ViewChild('deckTable')
  public userTable: DataTableComponent<Deck>;

  deckData$ = new BehaviorSubject<Deck[]>([]);
  refreshUserDataSource() {
    this.spinnerService.showSpinner(SpinnerType.LOADING);

    this.deckService.getAll().subscribe({
      next: (deckArray) => {
        this.deckData$.next(deckArray);
        this.userTable?.toggleAllOff();
      },
      complete: () => this.spinnerService.hideSpinner(SpinnerType.LOADING),
    });
  }
}
