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
import { environment } from 'src/environments/environment';

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
    super(`${environment.backendRootAddress}/api/v1/language`, httpClient);
  }

  search(searchParams: LanguageSearchParams): Observable<Language[]> {
    return of(languageJson);
  }

  getAll(): Observable<Language[]> {
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

export abstract class GenericFlashcardService extends GeneralRepositoryService<Flashcard> {
  constructor(protected httpClient: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/flashcard`, httpClient);
  }
  abstract search(searchParams: FlashcardSearchParams): Observable<Flashcard[]>;
  abstract getAllFlashcardsFromDeck(deckId: string): Observable<Flashcard[]>;
}

@Injectable()
export class MockFlashcardService extends GenericFlashcardService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }
  getAllFlashcardsFromDeck(deckId: string): Observable<Flashcard[]> {
    return of(flashcardJson.filter((f) => f.deckId == deckId));
  }
  search(searchParams: FlashcardSearchParams): Observable<Flashcard[]> {
    throw new Error('Method not implemented.');
  }

  getAll(): Observable<Flashcard[]> {
    return of(flashcardJson);
  }
}

// add real FlashcardService here!
