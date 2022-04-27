import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPaginatedListResponse } from 'src/app/shared/models/http/http-response-types';
import {
  IServiceSearchParams,
  SortColumn,
  SortType,
} from 'src/app/shared/models/other/api-query-types';
import { GeneralRepositoryService } from 'src/app/shared/services/general-repository-service';
import { environment } from 'src/environments/environment';
import { Deck } from '../models/deck.model';

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

@Injectable()
export class MockDeckService extends GeneralRepositoryService<Deck> {
  constructor(private http: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/Deck`, http);
  }
  search(
    params: DeckSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<Deck[]> {
    return of(DeckJson);
  }

  getAll(): Observable<Deck[]> {
    return of(DeckJson);
  }
}

@Injectable()
export class DeckService extends GeneralRepositoryService<Deck> {
  constructor(private http: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/Deck`, http);
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
}
