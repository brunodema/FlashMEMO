import { Inject, Injectable } from '@angular/core';
import { Observable, mergeMap, forkJoin, of, map } from 'rxjs';
import { GenericDeckService } from 'src/app/deck/services/deck.service';
import { User } from 'src/app/user/models/user.model';
import { GenericUserService } from 'src/app/user/services/user.service';

export class UserStats extends User {
  deckCount: number = 0;
  flashcardCount: number = 0;
  dueFlashcardCount: number = 0;
  dueDeckCount: number = 0;
  lastStudySession?: string = new Date(0).toISOString();

  public constructor(init?: Partial<UserStats>) {
    super();
    Object.assign(this, init);
  }
}

export abstract class GenericUserStatsService {
  constructor(
    @Inject('GenericUserService') protected userService: GenericUserService,
    @Inject('GenericDeckService') protected deckService: GenericDeckService
  ) {}

  getTypename(): string {
    return 'userdeck';
  }

  getUserStats(id: string): Observable<UserStats> {
    return this.userService
      .get(id)
      .pipe(
        mergeMap((userResponse) => {
          const deckResponse = this.deckService.getExtendedDeckInfo(
            userResponse.data.id
          );
          return forkJoin([of(userResponse), deckResponse]);
        })
      )
      .pipe(
        map((res) => {
          return new UserStats({
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
                return new Date(
                  Math.max(new Date(prev!).getTime(), new Date(next!).getTime())
                ).toISOString();
              }, undefined),
            dueFlashcardCount: res[1]
              .map((deck) => deck.dueFlashcardCount)
              .reduce((prev, next) => prev + next, 0),
            flashcardCount: res[1]
              .map((deck) => deck.flashcardCount)
              .reduce((prev, next) => prev + next, 0),
          });
        })
      );
  }
}

@Injectable()
export class MockUserStatsService extends GenericUserStatsService {
  constructor(
    @Inject('GenericUserService') protected userService: GenericUserService,
    @Inject('GenericDeckService') protected deckService: GenericDeckService
  ) {
    super(userService, deckService);
  }
}

@Injectable()
export class UserStatsService extends GenericUserStatsService {
  constructor(
    @Inject('GenericUserService') protected userService: GenericUserService,
    @Inject('GenericDeckService') protected deckService: GenericDeckService
  ) {
    super(userService, deckService);
  }
}
