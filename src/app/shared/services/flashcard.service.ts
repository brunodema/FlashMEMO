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
import {
  IBaseAPIResponse,
  IDataResponse,
} from '../models/http/http-response-types';

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

  create(object: IFlashcard): Observable<IDataResponse<string>> {
    return of({
      status: '200',
      message: 'Dummy Flashcard has been created.',
      errors: [],
      data: '',
    });
  }

  get(id: string): Observable<IDataResponse<IFlashcard>> {
    return of({
      status: '200',
      message: 'Dummy Flashcard object retrieved.',
      errors: [],
      data: {
        flashcardId: '',
        deckId: '',
        level: 0,
        frontContentLayout: 'SINGLE_BLOCK',
        backContentLayout: 'SINGLE_BLOCK',
        content1: '',
        content2: '',
        content3: '',
        content4: '',
        content5: '',
        content6: '',
        creationDate: '',
        lastUpdated: '',
        dueDate: '',
        answer: '',
      },
    });
  }

  update(id: string, object: IFlashcard): Observable<IDataResponse<string>> {
    return of({
      status: '200',
      message: 'Dummy Flashcard has been updated.',
      errors: [],
      data: '',
    });
  }

  delete(id: string): Observable<IBaseAPIResponse> {
    return of({
      status: '200',
      message: 'Dummy Flashcard has been deleted.',
      errors: [],
    });
  }
}

// add real FlashcardService here!
