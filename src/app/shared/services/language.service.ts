import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  IServiceSearchParams,
  SortType,
} from '../models/other/api-query-types';
import { Language } from '../models/shared-models';
import { GenericRepositoryService } from './general-repository-service';
import languageJson from 'src/assets/test_assets/Languages.json';
import { environment } from 'src/environments/environment';

export class LanguageSearchParams implements IServiceSearchParams {
  name: string;
  ISOCode: string;
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType | undefined;
  columnToSort?: '' | undefined;
}

export abstract class GenericLanguageService extends GenericRepositoryService<Language> {
  constructor(protected httpClient: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/language`, httpClient);
  }
  abstract search(searchParams: LanguageSearchParams): Observable<Language[]>;
}

@Injectable()
export class MockLanguageService extends GenericLanguageService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  search(searchParams: LanguageSearchParams): Observable<Language[]> {
    return of(languageJson);
  }

  getAll(): Observable<Language[]> {
    return of(languageJson);
  }
}

// add real LanguageService here!
