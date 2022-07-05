import { Component, Inject, ViewChild } from '@angular/core';
import { BehaviorSubject, mergeMap, tap, forkJoin, of } from 'rxjs';
import { ExtendedDeckInfoDTO } from 'src/app/deck/models/deck.model';
import { GenericDeckService } from 'src/app/deck/services/deck.service';
import { GenericUserService } from 'src/app/user/services/user.service';
import { GenericAuthService } from '../../services/auth.service';
import {
  GenericSpinnerService,
  SpinnerType,
} from '../../services/UI/spinner.service';
import {
  GenericUserStatsService,
  UserStats,
} from '../../services/user-stats.service';
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
    @Inject('GenericDeckService') protected deckService: GenericDeckService,
    @Inject('GenericUserStatsService')
    protected userStatsService: GenericUserStatsService
  ) {
    this.refreshDeckDataSource();
    this.refreshUserStatsDataSource();
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
  public deckTable: DataTableComponent<ExtendedDeckInfoDTO>;

  deckData$ = new BehaviorSubject<ExtendedDeckInfoDTO[]>([]);
  refreshDeckDataSource() {
    this.spinnerService.showSpinner(SpinnerType.LOADING);

    this.deckService
      .getExtendedDeckInfo(this.authService.loggedUser.getValue()?.id)
      .subscribe({
        next: (deckArray) => {
          this.deckData$.next(deckArray.slice(0, this.maxListSize));
          this.deckTable?.toggleAllOff();
        },
        complete: () => this.spinnerService.hideSpinner(SpinnerType.LOADING),
      });
  }

  userStats$ = new BehaviorSubject<UserStats | undefined>(undefined);
  refreshUserStatsDataSource() {
    // Spinner doesn't seem to be doing anything here though...
    this.spinnerService.showSpinner(SpinnerType.LOADING);
    this.userStatsService
      .getUserStats(this.authService.loggedUser.getValue()!.id)
      .subscribe({
        next: (stats) => {
          this.userStats$.next(stats);
        },
        complete: () => this.spinnerService.hideSpinner(SpinnerType.LOADING),
      });
  }
}
