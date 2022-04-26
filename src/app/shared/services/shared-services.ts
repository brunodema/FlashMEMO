import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  IServiceSearchParams,
  SortType,
} from '../models/other/api-query-types';
import { Language } from '../models/shared-models';
import { GeneralRepositoryService } from './general-repository-service';
import { Flashcard } from '../models/flashcard';

import languageJson from 'src/assets/test_assets/Languages.json';
import flashcardJson from 'src/assets/test_assets/Flashcards.json';

export class LanguageSearchParams implements IServiceSearchParams {
  name: string;
  ISOCode: string;
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType | undefined;
  columnToSort?: '' | undefined;
}

@Injectable()
export class MockLanguageService extends GeneralRepositoryService<Language> {
  constructor(protected httpClient: HttpClient) {
    super('', httpClient);
  }

  search(searchParams: LanguageSearchParams): Observable<Language[]> {
    return of(languageJson);
  }
}

// add real LanguageService here!

export class FlashcardSearchParams implements IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType | undefined;
  columnToSort?: '' | undefined;
  deckId: string;
  level: number;
  contentLayout: number;
  creationDate: string;
  lastUpdated: string;
  dueDate: string;
  answer: string;
}

@Injectable()
export class MockFlashcardService extends GeneralRepositoryService<Flashcard> {
  constructor(protected httpClient: HttpClient) {
    super('', httpClient);
  }

  search(searchParams: FlashcardSearchParams): Observable<Flashcard[]> {
    //return of(flashcardJson.filter((f) => (f.deckId = searchParams.deckId)));
    return of(flashcardJson);
  }
}
