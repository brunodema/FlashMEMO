import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Flashcard } from '../models/flashcard';
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

export abstract class GenericFlashcardService extends GenericRepositoryService<Flashcard> {
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
