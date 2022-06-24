import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import {
  IServiceSearchParams,
  SortType,
} from '../models/other/api-query-types';
import { Language } from '../models/shared-models';
import { GenericRepositoryService } from './general-repository.service';
import languageJson from 'src/assets/test_assets/Languages.json';
import { environment } from 'src/environments/environment';
import { IPaginatedListResponse } from '../models/http/http-response-types';
import { RepositoryServiceConfig } from 'src/app/app.module';
import { GenericAuthService } from './auth.service';

export class LanguageSearchParams implements IServiceSearchParams {
  name: string;
  languageISOCode: string;
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType | undefined;
  columnToSort?: '' | undefined;
}

export abstract class GenericLanguageService extends GenericRepositoryService<Language> {
  constructor(
    protected config: RepositoryServiceConfig,
    protected httpClient: HttpClient,
    @Inject('GenericAuthService') protected authService: GenericAuthService
  ) {
    super(
      `${config.backendAddress}/api/v1/Language`,
      config.maxPageSize,
      httpClient,
      authService
    );
  }
  abstract search(params: LanguageSearchParams): Observable<Language[]>;

  getTypename(): string {
    return 'language';
  }
}

@Injectable()
export class MockLanguageService extends GenericLanguageService {
  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG') config: RepositoryServiceConfig,
    protected httpClient: HttpClient,
    @Inject('GenericAuthService') protected authService: GenericAuthService
  ) {
    super(
      {
        backendAddress: config.backendAddress,
        maxPageSize: config.maxPageSize,
      },
      httpClient,
      authService
    );
  }

  search(searchParams: LanguageSearchParams): Observable<Language[]> {
    return of(languageJson);
  }

  getAll(): Observable<Language[]> {
    return of(languageJson);
  }
}

@Injectable()
export class LanguageService extends GenericLanguageService {
  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG') config: RepositoryServiceConfig,
    protected httpClient: HttpClient,
    @Inject('GenericAuthService') protected authService: GenericAuthService
  ) {
    super(
      {
        backendAddress: config.backendAddress,
        maxPageSize: config.maxPageSize,
      },
      httpClient,
      authService
    );
  }

  search(params: LanguageSearchParams): Observable<Language[]> {
    let formattedURL: string = `${this.repositoryServiceEndpoint}/search?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`;
    if (params.languageISOCode) {
      formattedURL += `&languageISOCode=${params.languageISOCode}`;
    }
    if (params.name) {
      formattedURL += `&name=${params.name}`;
    }
    if (params.sortType) {
      formattedURL += `&SortType=${params.sortType}`;
    }
    if (params.columnToSort) {
      formattedURL += `&ColumnToSort=${params.columnToSort}`;
    }

    return this.httpClient
      .get<IPaginatedListResponse<Language>>(formattedURL)
      .pipe(map((a) => a.data.results));
  }
}
