import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IFlashcard } from '../models/flashcard-models';
import {
  IServiceSearchParams,
  SortType,
} from '../models/other/api-query-types';
import { GenericRepositoryService } from './general-repository-service';
import flashcardJson from 'src/assets/test_assets/Flashcards.json';

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

export abstract class GenericFlashcardService extends GenericRepositoryService<IFlashcard> {
  constructor(protected httpClient: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/flashcard`, httpClient);
  }
  abstract search(
    searchParams: FlashcardSearchParams
  ): Observable<IFlashcard[]>;
  abstract getAllFlashcardsFromDeck(deckId: string): Observable<IFlashcard[]>;
}

@Injectable()
export class MockFlashcardService extends GenericFlashcardService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }
  getAllFlashcardsFromDeck(deckId: string): Observable<IFlashcard[]> {
    return of(flashcardJson.filter((f) => f.deckId == deckId));
  }
  search(searchParams: FlashcardSearchParams): Observable<IFlashcard[]> {
    throw new Error('Method not implemented.');
  }

  getAll(): Observable<IFlashcard[]> {
    return of(flashcardJson);
  }
}

// add real FlashcardService here!
