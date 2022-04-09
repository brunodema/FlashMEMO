import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';

import { GeneralDataTableService } from 'src/app/shared/services/data-table-service';
import {
  IServiceSearchParams,
  SortColumn,
  SortType,
} from 'src/app/shared/models/other/api-query-types';
import { IPaginatedListResponse } from 'src/app/shared/models/http/response-interfaces';

class NewsSearchParams implements IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  fromDate?: string;
  toDate?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  sortType?: SortType;
  columnToSort?: SortColumn;
}

@Injectable({
  providedIn: 'root',
})
export class NewsService implements GeneralDataTableService<News> {
  protected testServiceURL: string = `${environment.backendRootAddress}/api/v1/News`;

  constructor(private http: HttpClient) {}

  getAllNews(sortType: SortType = 0): Observable<News[]> {
    let pageSize = environment.maxPageSize;

    return this.http
      .get<IPaginatedListResponse<News>>(
        `${this.testServiceURL}/list?pageSize=${pageSize}`
      )
      .pipe(map((a) => a.data.results));
    // .pipe(map((a) => a.data.results.sort(comparisonFunction)));
  }

  search(
    params: NewsSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<News[]> {
    let formattedURL: string = `${this.testServiceURL}/search?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`;
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

    return this.http
      .get<IPaginatedListResponse<News>>(formattedURL)
      .pipe(map((a) => a.data.results));
  }
}
