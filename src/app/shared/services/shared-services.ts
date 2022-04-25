import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  IServiceSearchParams,
  SortType,
} from '../models/other/api-query-types';
import { Language } from '../models/shared-models';
import { GeneralRepositoryService } from './general-repository-service';

import languageJson from 'src/assets/test_assets/Languages.json';

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
