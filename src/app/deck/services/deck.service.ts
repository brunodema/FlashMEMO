import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { Deck, ExtendedDeckInfoDTO } from '../models/deck.model';

import DeckJson from 'src/assets/test_assets/Decks.json';

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
  constructor(protected httpClient: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/deck`, httpClient);
  }
  abstract search(searchParams: DeckSearchParams): Observable<Deck[]>;
  abstract getExtendedDeckInfo(
    ownerId?: string
  ): Observable<ExtendedDeckInfoDTO[]>;
}

@Injectable()
export class MockDeckService extends GenericDeckService {
  constructor(private http: HttpClient) {
    super(http);
  }
  search(
    params: DeckSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<Deck[]> {
    return of(DeckJson);
  }

  getAll(): Observable<Deck[]> {
    return of(DeckJson);
  }

  getById(id: string): Observable<Deck> {
    return of(DeckJson.filter((x) => x.deckId == id)[0]);
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
   * @param ownerId Brief explanation of how this Mock works: (1) if 'ownerId' is specified, it filters for the appropriate value, otherwise gets eveything (reason for 'true' there). Then, it has to map evey single object to the array ('x' is an array of 'User'), so the missing properties are added, and for this, I need to convert 'x' to any first. Dummy value of '1' is returned to not involve any extra services.
   * @returns What I want :)
   */
  getExtendedDeckInfo(ownerId?: string): Observable<ExtendedDeckInfoDTO[]> {
    return of(
      DeckJson.filter((deck) => (ownerId ? deck.ownerId === ownerId : true))
    ).pipe(
      map((deckArray) =>
        deckArray.map((deck) => {
          let extendedDeckInfo = deck as any;
          extendedDeckInfo.flashcardCount = 1;
          extendedDeckInfo.dueFlashcards = 1;
          return extendedDeckInfo;
        })
      )
    );
  }
}

@Injectable()
export class DeckService extends GenericDeckService {
  constructor(private http: HttpClient) {
    super(http);
  }

  search(
    params: DeckSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<Deck[]> {
    let formattedURL: string = `${this.endpointURL}/search?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`;
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

    return this.http
      .get<IPaginatedListResponse<Deck>>(formattedURL)
      .pipe(map((a) => a.data.results));
  }

  getExtendedDeckInfo(ownerId?: string): Observable<ExtendedDeckInfoDTO[]> {
    console.log(ownerId);
    return this.http
      .get<IDataResponse<ExtendedDeckInfoDTO[]>>(
        `${this.endpointURL}/list/extended${
          ownerId ? '?ownerId=' + ownerId : ''
        }`
      )
      .pipe(map((y) => y.data));
  }
}
