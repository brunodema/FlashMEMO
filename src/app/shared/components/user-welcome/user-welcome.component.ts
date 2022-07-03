import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { BehaviorSubject, mergeMap, tap, forkJoin, of } from 'rxjs';
import { ExtendedDeckInfoDTO } from 'src/app/deck/models/deck.model';
import { GenericDeckService } from 'src/app/deck/services/deck.service';
import { UserWithDeckData } from 'src/app/user/models/user.model';
import { GenericUserService } from 'src/app/user/services/user.service';
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
    @Inject('GenericDeckService') protected deckService: GenericDeckService,
    @Inject('GenericUserService') protected userService: GenericUserService
  ) {
    this.refreshDeckDataSource();
    this.refreshUserWithDeckDataSource();
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

  userStats$ = new BehaviorSubject<UserWithDeckData | undefined>(undefined);
  refreshUserWithDeckDataSource() {
    this.spinnerService.showSpinner(SpinnerType.LOADING);
    this.userService
      .get(this.authService.loggedUser.getValue()!.id)
      .pipe(
        mergeMap((userResponse) => {
          const deckResponse = this.deckService.getExtendedDeckInfo(
            userResponse.data.id
          );
          return forkJoin([of(userResponse), deckResponse]);
        })
      )
      .subscribe((res) => {
        this.userStats$.next({
          id: res[0].data.id,
          email: res[0].data.email,
          name: res[0].data.name,
          surname: res[0].data.surname,
          username: res[0].data.username,
          lastLogin: res[0].data.lastLogin,
          deckCount: res[1].length,
          // super cool map + reduce approach taken from: https://stackoverflow.com/questions/23247859/better-way-to-sum-a-property-value-in-an-array. Had to take initial value considerations from here: https://stackoverflow.com/questions/23359173/javascript-reduce-an-empty-array.
          dueDeckCount: res[1]
            .map((deck) => deck.dueFlashcardCount)
            .filter((value) => value > 0).length,
          lastStudySession: res[1]
            .map((deck) => deck.lastStudySession)
            .reduce((prev, next) => {
              // The madness below is an attempt to short-circuit the method if applicable, and to return 'undefined' in the end if no valid values exist - which imply that no study sessions were made so far.
              if (prev && !next) return prev;
              if (!prev && next) return next;
              if (!prev && !next) return undefined;

              return (
                new Date(
                  Math.max(new Date(prev!).getTime(), new Date(next!).getTime())
                ).toISOString(),
                undefined
              );
            }),
          dueFlashcardCount: res[1]
            .map((deck) => deck.dueFlashcardCount)
            .reduce((prev, next) => prev + next, 0),
          flashcardCount: res[1]
            .map((deck) => deck.flashcardCount)
            .reduce((prev, next) => prev + next, 0),
        });
        this.spinnerService.hideSpinner(SpinnerType.LOADING);
      });
  }
}
