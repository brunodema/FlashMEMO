import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IFlashcard } from '../models/flashcard-models';
import {
  IServiceSearchParams,
  SortType,
} from '../models/other/api-query-types';
import { GenericRepositoryService } from './general-repository.service';
import flashcardJson from 'src/assets/test_assets/Flashcards.json';
import {
  IBaseAPIResponse,
  IDataResponse,
  IPaginatedListResponse,
} from '../models/http/http-response-types';

export class FlashcardSearchParams implements IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType | undefined;
  columnToSort?: '' | undefined;
  deckId: string;
  level: number;
  contentLayout: number;
  fromCreationDate: string;
  toCreationDate: string;
  fromLastUpdated: string;
  toLastUpdated: string;
  fromDueDate: string;
  toDueDate: string;
  answer: string;
}

export abstract class GenericFlashcardService extends GenericRepositoryService<IFlashcard> {
  constructor(protected http: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/flashcard`, http);
  }
  abstract search(params: FlashcardSearchParams): Observable<IFlashcard[]>;
  abstract getAllFlashcardsFromDeck(deckId: string): Observable<IFlashcard[]>;
  abstract getNumberOfFlashcardsFromDeck(deckId: string): Observable<number>;

  /**
   * Yes, this function is declared here since I can't declare it on the IFlashcard classes, because TS is fucking stupid and tries to (de)serialize the function when working with JSONs (breaks the model seeder)
   * @param flashcard
   * @param newLevel
   */
  advanceToNextLevel(flashcard: IFlashcard, newLevel: number): void {
    flashcard.level = newLevel;
    flashcard.dueDate = new Date(
      new Date().setDate(new Date().getDate() + flashcard.level ** 2)
    ).toISOString();
    console.log(
      'today is ' + new Date().toISOString(),
      'due date is now ' + flashcard.dueDate
    );
  }
}

@Injectable()
export class MockFlashcardService extends GenericFlashcardService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }
  getAllFlashcardsFromDeck(deckId: string): Observable<IFlashcard[]> {
    return of(flashcardJson.filter((f) => f.deckId == deckId));
  }
  getNumberOfFlashcardsFromDeck(deckId: string): Observable<number> {
    return of(flashcardJson.filter((f) => f.deckId == deckId).length);
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
      data: {} as IFlashcard,
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

@Injectable()
export class FlashcardService extends GenericFlashcardService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }
  search(params: FlashcardSearchParams): Observable<IFlashcard[]> {
    {
      let formattedURL: string = `${this.endpointURL}/search?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`;
      if (params.sortType) {
        formattedURL += `&SortType=${params.sortType}`;
      }
      if (params.columnToSort) {
        formattedURL += `&ColumnToSort=${params.columnToSort}`;
      }
      if (params.fromCreationDate) {
        formattedURL += `&fromCreationDate=${params.fromCreationDate}`;
      }
      if (params.toCreationDate) {
        formattedURL += `&toCreationDate=${params.toCreationDate}`;
      }
      if (params.fromLastUpdated) {
        formattedURL += `&fromLastUpdated=${params.fromLastUpdated}`;
      }
      if (params.toLastUpdated) {
        formattedURL += `&toLastUpdated=${params.toLastUpdated}`;
      }
      if (params.fromDueDate) {
        formattedURL += `&fromDueDate=${params.fromDueDate}`;
      }
      if (params.toDueDate) {
        formattedURL += `&toDueDate=${params.toDueDate}`;
      }
      if (params.answer) {
        formattedURL += `&answer=${params.answer}`;
      }
      if (params.level) {
        formattedURL += `&level=${params.level}`;
      }

      return this.http
        .get<IPaginatedListResponse<IFlashcard>>(formattedURL)
        .pipe(map((a) => a.data.results));
    }
  }

  getAllFlashcardsFromDeck(deckId: string): Observable<IFlashcard[]> {
    let formattedURL: string = `${this.endpointURL}/GetAllFlashcardsFromDeck/${deckId}`;
    return this.http
      .get<IDataResponse<IFlashcard[]>>(formattedURL)
      .pipe(map((a) => a.data));
  }
  getNumberOfFlashcardsFromDeck(deckId: string): Observable<number> {
    let formattedURL: string = `${this.endpointURL}/GetAllFlashcardsFromDeck/${deckId}?countOnly=true`;
    return this.http
      .get<IDataResponse<number>>(formattedURL)
      .pipe(map((a) => a.data));
  }
}
