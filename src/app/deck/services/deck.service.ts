import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IBaseAPIResponse,
  IDataResponse,
  IPaginatedListResponse,
} from 'src/app/shared/models/http/http-response-types';
import {
  IServiceSearchParams,
  SortColumn,
  SortType,
} from 'src/app/shared/models/other/api-query-types';
import { GenericRepositoryService } from 'src/app/shared/services/general-repository.service';
import { Deck, ExtendedDeckInfoDTO } from '../models/deck.model';

import deckJson from 'src/assets/test_assets/Decks.json';
import flashcardJson from 'src/assets/test_assets/Flashcards.json';
import { RepositoryServiceConfig } from 'src/app/app.module';

class DeckSearchParams implements IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  ownerEmail?: string;
  languageCode?: string;
  name?: string;
  description?: string;
  fromCreationDate?: string;
  toCreationDate?: string;
  fromLastUpdated?: string;
  toLastUpdated?: string;
  sortType?: SortType;
  columnToSort?: SortColumn;
}

export abstract class GenericDeckService extends GenericRepositoryService<Deck> {
  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG') config: RepositoryServiceConfig,
    protected httpClient: HttpClient
  ) {
    super(
      {
        backendAddress: `${config.backendAddress}/api/v1/Deck`,
        maxPageSize: config.maxPageSize,
      },
      httpClient
    );
  }
  abstract search(searchParams: DeckSearchParams): Observable<Deck[]>;
  abstract getExtendedDeckInfo(
    ownerId?: string
  ): Observable<ExtendedDeckInfoDTO[]>;

  getTypename(): string {
    return 'deck';
  }
}

@Injectable()
export class MockDeckService extends GenericDeckService {
  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG') config: RepositoryServiceConfig,
    protected httpClient: HttpClient
  ) {
    super(
      {
        backendAddress: config.backendAddress,
        maxPageSize: config.maxPageSize,
      },
      httpClient
    );
  }

  search(
    params: DeckSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<Deck[]> {
    return of(deckJson);
  }

  getAll(): Observable<Deck[]> {
    return of(deckJson);
  }

  getById(id: string): Observable<Deck> {
    console.log(`GenericDeckService: getting by id '${id}'`);
    let obj = deckJson.filter((x) => x.deckId == id)[0];
    console.log('GenericDeckService: returning object ', obj);
    return of(obj);
  }

  create(object: Deck): Observable<IDataResponse<string>> {
    return of({
      status: '200',
      message: 'Dummy Deck has been created.',
      errors: [],
      data: '',
    });
  }

  get(id: string): Observable<IDataResponse<Deck>> {
    return of({
      status: '200',
      message: 'Dummy Deck object retrieved.',
      errors: [],
      data: {} as Deck,
    });
  }

  update(id: string, object: Deck): Observable<IDataResponse<string>> {
    return of({
      status: '200',
      message: 'Dummy Deck has been updated.',
      errors: [],
      data: '',
    });
  }

  delete(id: string): Observable<IBaseAPIResponse> {
    return of({
      status: '200',
      message: 'Dummy Deck has been deleted.',
      errors: [],
    });
  }

  /**
   *
   * @param ownerId Brief explanation of how this Mock works: (1) if 'ownerId' is specified, it filters for the appropriate value, otherwise gets eveything (reason for 'true' there). Then, it has to map evey single object to the array ('x' is an array of 'User'), so the missing properties are added, and for this, I need to convert 'x' to any first. Then, it checks 'flashcardJson' to data that matches the filters.
   * @returns What I want :)
   */
  getExtendedDeckInfo(ownerId?: string): Observable<ExtendedDeckInfoDTO[]> {
    return of(
      deckJson.filter((deck) => (ownerId ? deck.ownerId === ownerId : true))
    ).pipe(
      map((deckArray) =>
        deckArray.map((deck) => {
          let extendedDeckInfo = deck as any;
          let count = flashcardJson.filter(
            (flashcard) => flashcard.deckId == deck.deckId
          ).length;
          let dueCount = flashcardJson.filter(
            (flashcard) =>
              flashcard.deckId == deck.deckId &&
              new Date(flashcard.dueDate) <= new Date()
          ).length;
          extendedDeckInfo.flashcardCount = count;
          extendedDeckInfo.dueFlashcards = dueCount;
          return extendedDeckInfo;
        })
      )
    );
  }
}

@Injectable()
export class DeckService extends GenericDeckService {
  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG') config: RepositoryServiceConfig,
    protected httpClient: HttpClient
  ) {
    super(
      {
        backendAddress: config.backendAddress,
        maxPageSize: config.maxPageSize,
      },
      httpClient
    );
  }

  search(
    params: DeckSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<Deck[]> {
    let formattedURL: string = `${this.config.backendAddress}/search?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`;
    if (params.fromCreationDate) {
      formattedURL += `&FromCreationDate=${params.fromCreationDate}`;
    }
    if (params.toCreationDate) {
      formattedURL += `&ToCreationDate=${params.toCreationDate}`;
    }
    if (params.fromLastUpdated) {
      formattedURL += `&FromLastUpdated=${params.fromLastUpdated}`;
    }
    if (params.toLastUpdated) {
      formattedURL += `&ToLastUpdated=${params.toLastUpdated}`;
    }
    if (params.ownerEmail) {
      formattedURL += `&OwnerEmail=${params.ownerEmail}`;
    }
    if (params.name) {
      formattedURL += `&Name=${params.name}`;
    }
    if (params.description) {
      formattedURL += `&Description=${params.description}`;
    }
    if (params.languageCode) {
      formattedURL += `&LaguangeCode=${params.languageCode}`;
    }

    return this.httpClient
      .get<IPaginatedListResponse<Deck>>(formattedURL)
      .pipe(map((a) => a.data.results));
  }

  getExtendedDeckInfo(ownerId?: string): Observable<ExtendedDeckInfoDTO[]> {
    console.log(ownerId);
    return this.httpClient
      .get<IDataResponse<ExtendedDeckInfoDTO[]>>(
        `${this.config.backendAddress}/list/extended${
          ownerId ? '?ownerId=' + ownerId : ''
        }`
      )
      .pipe(map((y) => y.data));
  }
}
