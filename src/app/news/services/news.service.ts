import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { News } from '../models/news.model';

import { map } from 'rxjs/operators';

import {
  IServiceSearchParams,
  SortType,
} from 'src/app/shared/models/other/api-query-types';
import {
  IBaseAPIResponse,
  IDataResponse,
  IPaginatedListResponse,
} from 'src/app/shared/models/http/http-response-types';
import { GenericRepositoryService } from 'src/app/shared/services/general-repository.service';

import newsJson from 'src/assets/test_assets/News.json';
import { RepositoryServiceConfig } from 'src/app/app.module';

class NewsSearchParams implements IServiceSearchParams {
  pageSize: number;
  pageNumber: number;
  fromDate?: string;
  toDate?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  sortType?: SortType;
  columnToSort?: string;
}

export abstract class GenericNewsService extends GenericRepositoryService<News> {
  constructor(
    protected config: RepositoryServiceConfig,
    protected httpClient: HttpClient
  ) {
    super(
      `${config.backendAddress}/api/v1/News`,
      config.maxPageSize,
      httpClient
    );
  }
  abstract search(
    searchParams: NewsSearchParams
  ): Observable<IPaginatedListResponse<News>>;

  getTypename(): string {
    return 'news';
  }
}

@Injectable()
export class MockNewsService extends GenericNewsService {
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
    params: NewsSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<IPaginatedListResponse<News>> {
    let results = newsJson.slice(
      (params.pageNumber - 1) * params.pageSize,
      (params.pageNumber - 1) * params.pageSize + params.pageSize
    );
    let resultLenght = results.length;

    return of({
      status: '200',
      message: 'News successfully retrieved.',
      errors: [],
      data: {
        results: results,
        pageNumber: params.pageNumber,
        totalPages: Math.ceil(newsJson.length / params.pageSize),
        resultSize: resultLenght,
        totalAmount: newsJson.length,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    });
  }

  getAll(): Observable<News[]> {
    return of(newsJson);
  }

  getById(id: string): Observable<News> {
    let obj = newsJson.filter((x) => x.newsId == id)[0];
    return of(obj);
  }

  create(object: News): Observable<IDataResponse<string>> {
    return of({
      status: '200',
      message: 'Dummy News has been created.',
      errors: [],
      data: '',
    });
  }

  get(id: string): Observable<IDataResponse<News>> {
    return of({
      status: '200',
      message: 'Dummy News object retrieved.',
      errors: [],
      data: {} as News,
    });
  }

  update(id: string, object: News): Observable<IDataResponse<string>> {
    return of({
      status: '200',
      message: 'Dummy News has been updated.',
      errors: [],
      data: '',
    });
  }

  delete(id: string): Observable<IBaseAPIResponse> {
    return of({
      status: '200',
      message: 'Dummy News has been deleted.',
      errors: [],
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class NewsService extends GenericNewsService {
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
    params: NewsSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<IPaginatedListResponse<News>> {
    let formattedURL: string = `${this.repositoryServiceEndpoint}/search?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`;
    if (params.fromDate) {
      formattedURL += `&FromDate=${params.fromDate}`;
    }
    if (params.toDate) {
      formattedURL += `&ToDate=${params.toDate}`;
    }
    if (params.title) {
      formattedURL += `&Title=${params.title}`;
    }
    if (params.subtitle) {
      formattedURL += `&Subtitle=${params.subtitle}`;
    }
    if (params.content) {
      formattedURL += `&Content=${params.content}`;
    }
    if (params.sortType) {
      formattedURL += `&SortType=${params.sortType}`;
    }
    if (params.columnToSort) {
      formattedURL += `&ColumnToSort=${params.columnToSort}`;
    }

    return this.httpClient.get<IPaginatedListResponse<News>>(formattedURL);
  }
}
